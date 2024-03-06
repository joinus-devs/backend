import { DataSource, In, QueryFailedError, Repository } from "typeorm";
import Errors from "../constants/errors";
import {
  Category,
  Club,
  ClubCategory,
  ClubConverter,
  ClubCreate,
  ClubDto,
  ClubUpdate,
  ClubWithUserInfoDto,
  Role,
  User,
  UserInClub,
} from "../models";
import { ClubImage } from "../models/clubImage";
import { TransactionManager } from "../modules";
import { CursorDto, ErrorResponse, Nullable } from "../types";

export interface IClubService {
  find(id: number): Promise<Nullable<ClubDto>>;
  findAll(cursor?: number, limit?: number): Promise<CursorDto<ClubDto[]>>;
  findAllByUser(
    userId: number,
    cursor?: number,
    limit?: number
  ): Promise<CursorDto<ClubWithUserInfoDto[]>>;
  findAllByCategory(
    categoryId: number,
    cursor?: number,
    limit?: number
  ): Promise<CursorDto<ClubDto[]>>;
  join(userId: number, clubId: number): Promise<number>;
  reject(requesterId: number, clubId: number, userId: number): Promise<number>;
  setRole(
    requesterId: number,
    clubId: number,
    userId: number,
    role: Role
  ): Promise<number>;
  create(userId: number, clubCreate: ClubCreate): Promise<number>;
  update(id: number, clubUpdate: ClubUpdate): Promise<number>;
  delete(id: number): Promise<number>;
}

export class ClubService implements IClubService {
  private static _instance: Nullable<ClubService> = null;
  private _transactionManager: TransactionManager;
  private _clubRepository: Repository<Club>;
  private _userRepository: Repository<User>;
  private _categoryRepository: Repository<Category>;

  private constructor(
    dataSoruce: DataSource,
    transactionManager: TransactionManager
  ) {
    this._transactionManager = transactionManager;
    this._clubRepository = dataSoruce.getRepository(Club);
    this._userRepository = dataSoruce.getRepository(User);
    this._categoryRepository = dataSoruce.getRepository(Category);
  }

  static getInstance(
    dataSoruce: DataSource,
    transactionManager: TransactionManager
  ) {
    if (!this._instance) {
      this._instance = new ClubService(dataSoruce, transactionManager);
    }

    return this._instance;
  }

  find = async (id: number) => {
    let club;
    try {
      club = await this._clubRepository.findOne({
        where: { id, deleted_at: undefined },
        relations: ["categories", "categories.category", "images"],
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }

    // 클럽이 없을 경우
    if (!club) {
      throw Errors.ClubNotFound;
    }

    return ClubConverter.toDto(club);
  };

  findAll = async (cursor?: number, limit = 10) => {
    try {
      const clubs = await this._clubRepository
        .createQueryBuilder("club")
        .leftJoinAndSelect("club.categories", "category")
        .leftJoinAndSelect("club.images", "image")
        .where("club.deleted_at IS NULL")
        .andWhere(cursor ? "club.id < :cursor" : "1=1", { cursor })
        .orderBy("club.created_at", "DESC")
        .take(limit + 1)
        .getMany();
      const next = clubs.length > limit ? clubs[clubs.length - 2].id : null;
      return {
        data: clubs.slice(0, limit).map((club) => ClubConverter.toDto(club)),
        next,
      };
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  findAllByUser = async (userId: number, cursor?: number, limit = 10) => {
    try {
      const clubs = await this._clubRepository
        .createQueryBuilder("club")
        .leftJoinAndSelect("club.users", "user", "user.deleted_at IS NULL")
        .leftJoinAndSelect("club.categories", "category")
        .leftJoinAndSelect("club.images", "image")
        .where("user.user_id = :id", { id: userId })
        .andWhere("club.deleted_at IS NULL")
        .andWhere(cursor ? "user.id < :cursor" : "1=1", { cursor })
        .orderBy("user.created_at", "DESC")
        .take(limit + 1)
        .getMany();
      const next = clubs.length > limit ? clubs[clubs.length - 2].id : null;
      return {
        data: clubs
          .slice(0, limit)
          .map((club) => ClubConverter.toDtoWithUserInfo(club)),
        next,
      };
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  findAllByCategory = async (
    categoryId: number,
    cursor?: number,
    limit = 10
  ) => {
    try {
      const clubs = await this._clubRepository
        .createQueryBuilder("club")
        .leftJoinAndSelect(
          "club.categories",
          "category",
          "category.deleted_at IS NULL"
        )
        .where("category.category_id = :id", { id: categoryId })
        .andWhere("club.deleted_at IS NULL")
        .andWhere(cursor ? "club.id < :cursor" : "1=1", { cursor })
        .orderBy("club.created_at", "DESC")
        .take(limit + 1)
        .getMany();
      const next = clubs.length > limit ? clubs[clubs.length - 2].id : null;
      return {
        data: clubs.slice(0, limit).map((club) => ClubConverter.toDto(club)),
        next,
      };
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  join = async (userId: number, clubId: number) => {
    // 유저가 존재하는지 확인
    const user = await this._userRepository.findOne({
      where: { id: userId, deleted_at: undefined },
    });
    if (!user) {
      throw Errors.UserNotFound;
    }

    // 클럽이 존재하는지 확인
    const club = await this._clubRepository.findOne({
      where: { id: clubId, deleted_at: undefined },
    });
    if (!club) {
      throw Errors.ClubNotFound;
    }

    // 이미 가입한 클럽인지 확인
    const userInClub = await this._clubRepository
      .createQueryBuilder("club")
      .leftJoin("club.users", "user")
      .where("user.user_id = :id", { id: userId })
      .andWhere("club.id = :clubId", { clubId })
      .getOne();
    if (userInClub) {
      throw Errors.UserAlreadyJoined;
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const userInClub = new UserInClub();
        userInClub.user = user;
        userInClub.club = club;
        await manager.getRepository(UserInClub).save(userInClub);
        return userId;
      });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw Errors.InternalServerError;
    }
  };

  reject = async (requesterId: number, clubId: number, userId: number) => {
    if (requesterId === userId) {
      throw Errors.BadRequest;
    }

    const requester = await this._userRepository
      .createQueryBuilder("user")
      .leftJoin("user.clubs", "club")
      .addSelect("club.role", "user_role")
      .where("user.id = :id", { id: requesterId })
      .andWhere("club.club_id = :clubId", { clubId })
      .andWhere("club.role = :role", { role: Role.Admin })
      .getOne();

    // 요청자가 존재하는지 확인
    if (!requester) {
      throw Errors.NotAdmin;
    }

    // 요청자의 권한 확인
    if (requester.role !== Role.Admin && requester.role !== Role.Staff) {
      throw Errors.NotStaff;
    }

    // 유저가 존재하는지 확인
    const user = await this._userRepository.findOne({
      where: { id: userId, deleted_at: undefined },
    });
    if (!user) {
      throw Errors.UserNotFound;
    }

    // 클럽이 존재하는지 확인
    const club = await this._clubRepository.findOne({
      where: { id: clubId, deleted_at: undefined },
    });
    if (!club) {
      throw Errors.ClubNotFound;
    }

    // 유저가 클럽에 가입되어 있는지 확인
    const userInClub = await this._clubRepository
      .createQueryBuilder("club")
      .leftJoinAndSelect("club.users", "user")
      .where("user.user_id = :id", { id: userId })
      .andWhere("club.id = :clubId", { clubId })
      .getOne();
    if (!userInClub) {
      throw Errors.UserNotFoundInClub;
    }
    if (userInClub.users[0].role !== Role.Pending) {
      throw Errors.UserNotPending;
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        await manager
          .getRepository(UserInClub)
          .createQueryBuilder()
          .delete()
          .where("user_id = :userId", { userId })
          .andWhere("club_id = :clubId", { clubId })
          .execute();
        return userId;
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  setRole = async (
    requesterId: number,
    clubId: number,
    userId: number,
    role: Role
  ) => {
    if (requesterId === userId) {
      throw Errors.BadRequest;
    }

    if (role === Role.Admin) {
      throw Errors.BadRequest;
    }

    const requester = await this._userRepository
      .createQueryBuilder("user")
      .leftJoin("user.clubs", "club")
      .addSelect("club.role", "user_role")
      .where("user.id = :id", { id: requesterId })
      .andWhere("club.club_id = :clubId", { clubId })
      .andWhere("club.role = :role", { role: Role.Admin })
      .getOne();

    // 요청자가 존재하는지 확인
    if (!requester) {
      throw Errors.NotAdmin;
    }

    // 요청자의 권한 확인
    if (requester.role !== Role.Admin && role === Role.Staff) {
      throw Errors.NotAdmin;
    }

    // 요청자의 권한 확인
    if (requester.role !== Role.Admin && requester.role !== Role.Staff) {
      throw Errors.NotStaff;
    }

    // 유저가 존재하는지 확인
    const user = await this._userRepository.findOne({
      where: { id: userId, deleted_at: undefined },
    });
    if (!user) {
      throw Errors.UserNotFound;
    }

    // 클럽이 존재하는지 확인
    const club = await this._clubRepository.findOne({
      where: { id: clubId, deleted_at: undefined },
    });
    if (!club) {
      throw Errors.ClubNotFound;
    }

    // 유저가 클럽에 가입되어 있는지 확인
    const userInClub = await this._clubRepository
      .createQueryBuilder("club")
      .leftJoin("club.users", "user")
      .where("user.user_id = :id", { id: userId })
      .andWhere("club.id = :clubId", { clubId })
      .getOne();

    if (!userInClub) {
      throw Errors.UserNotFoundInClub;
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        await manager
          .getRepository(UserInClub)
          .createQueryBuilder()
          .update()
          .set({ role })
          .where("user_id = :userId", { userId })
          .andWhere("club_id = :clubId", { clubId })
          .execute();
        return userId;
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  create = async (userId: number, clubCreate: ClubCreate) => {
    // 유저가 존재하는지 확인
    const user = await this._userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw Errors.UserNotFound;
    }

    // 카테고리가 존재하는지 확인
    const category = await this._categoryRepository.findOne({
      where: { id: clubCreate.categories[0] },
    });
    if (!category) {
      throw Errors.CategoryNotFound;
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const club = ClubConverter.fromCreate(clubCreate);
        const userInClub = new UserInClub();
        userInClub.user = user;
        userInClub.club = club;
        userInClub.role = Role.Admin;
        club.users = [userInClub];
        club.images = clubCreate.images.map((image) => {
          const clubImage = new ClubImage();
          clubImage.url = image.url;
          clubImage.type = image.type;
          return clubImage;
        });
        const clubCategory = new ClubCategory();
        clubCategory.club = club;
        clubCategory.category = category;
        club.categories = [clubCategory];
        try {
          const result = await manager.getRepository(Club).save(club);
          return result.id;
        } catch (err) {
          if (
            err instanceof QueryFailedError &&
            err.driverError.errno === 1062
          ) {
            throw Errors.ClubNameAlreadyExists;
          }
          throw err;
        }
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  update = async (id: number, clubUpdate: ClubUpdate) => {
    const club = await this._clubRepository.findOne({
      where: { id, deleted_at: undefined },
    });

    if (!club) {
      throw Errors.ClubNotFound;
    }

    const findedCategories = await this._categoryRepository.findBy({
      id: In(clubUpdate.categories),
    });

    if (findedCategories.length === 0) {
      throw Errors.CategoryRequired;
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const club = ClubConverter.fromUpdate(id, clubUpdate);
        const { categories, images, ...rest } = club;
        const result = await manager.getRepository(Club).save(rest);

        await manager.getRepository(ClubCategory).delete({ club_id: id });
        await manager.getRepository(ClubImage).delete({ club_id: id });

        const clubCategories = findedCategories.map((category) => {
          const clubCategory = new ClubCategory();
          clubCategory.club = club;
          clubCategory.category = category;
          return clubCategory;
        });

        await manager.getRepository(ClubCategory).save(clubCategories);

        const clubImages = clubUpdate.images.map((image) => {
          const clubImage = new ClubImage();
          clubImage.club = club;
          clubImage.url = image.url;
          clubImage.type = image.type;
          return clubImage;
        });

        await manager.getRepository(ClubImage).save(clubImages);

        return result.id;
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  delete = async (id: number) => {
    try {
      await this._clubRepository.update(id, { deleted_at: new Date() });
      return id;
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };
}
