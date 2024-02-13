import { QueryFailedError, Repository } from "typeorm";
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
import { TransactionManager } from "../modules";
import { CursorDto, ErrorResponse, Nullable } from "../types";

export interface IClubService {
  find(id: number): Promise<Nullable<ClubDto>>;
  findAll(): Promise<ClubDto[]>;
  findAllByUser(
    userId: number,
    cursor?: number,
    limit?: number
  ): Promise<CursorDto<ClubWithUserInfoDto[]>>;
  findAllByCategory(categoryId: number): Promise<ClubDto[]>;
  join(userId: number, clubId: number): Promise<number>;
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
    transactionManager: TransactionManager,
    clubRepository: Repository<Club>,
    userRepository: Repository<User>,
    categoryRepository: Repository<Category>
  ) {
    this._transactionManager = transactionManager;
    this._clubRepository = clubRepository;
    this._userRepository = userRepository;
    this._categoryRepository = categoryRepository;
  }

  static getInstance(
    transactionManager: TransactionManager,
    clubRepository: Repository<Club>,
    userRepository: Repository<User>,
    categoryRepository: Repository<Category>
  ) {
    if (!this._instance) {
      this._instance = new ClubService(
        transactionManager,
        clubRepository,
        userRepository,
        categoryRepository
      );
    }

    return this._instance;
  }

  find = async (id: number) => {
    let club;
    try {
      club = await this._clubRepository.findOne({
        where: { id, deleted_at: undefined },
        relations: ["categories", "categories.category"],
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

  findAll = async () => {
    try {
      const clubs = await this._clubRepository.find({
        where: { deleted_at: undefined },
        relations: ["categories", "categories.category"],
      });
      return clubs.map((club) => ClubConverter.toDto(club));
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

  findAllByCategory = async (categoryId: number) => {
    try {
      const clubs = await this._clubRepository
        .createQueryBuilder("club")
        .leftJoinAndSelect("club.categories", "category")
        .where("category.id = :id", { id: categoryId, deleted_at: undefined })
        .getMany();
      return clubs.map((club) => ClubConverter.toDto(club));
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
      throw Errors.UserNotFound;
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
    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const result = await manager
          .getRepository(Club)
          .save(ClubConverter.fromUpdate(id, clubUpdate));
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
