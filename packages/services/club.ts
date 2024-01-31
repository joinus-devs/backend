import { QueryFailedError, Repository } from "typeorm";
import {
  Category,
  Club,
  ClubCategory,
  ClubConverter,
  ClubCreate,
  ClubDto,
  ClubUpdate,
  User,
} from "../models";
import { UserInClub } from "../models/userInClub";
import { TransactionManager } from "../modules";
import { ErrorResponse, Nullable } from "../types";

export interface IClubService {
  find(id: number): Promise<Nullable<ClubDto>>;
  findAll(): Promise<ClubDto[]>;
  findAllByUser(userId: number): Promise<ClubDto[]>;
  findAllByCategory(categoryId: number): Promise<ClubDto[]>;
  join(userId: number, clubId: number): Promise<number>;
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
      });
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }

    // check if club exists
    if (!club) {
      throw new ErrorResponse(404, "Club not found");
    }

    return ClubConverter.toDto(club);
  };

  findAll = async () => {
    try {
      const clubs = await this._clubRepository.find();
      return clubs.map((club) => ClubConverter.toDto(club));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  findAllByUser = async (userId: number) => {
    try {
      const clubs = await this._clubRepository
        .createQueryBuilder("club")
        .leftJoinAndSelect("club.users", "user")
        .where("user.id = :id", { id: userId, deleted_at: undefined })
        .getMany();
      return clubs.map((club) => ClubConverter.toDto(club));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
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
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  join = async (userId: number, clubId: number) => {
    // check if user exists
    const user = await this._userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }

    // check if club exists
    const club = await this._clubRepository.findOne({ where: { id: clubId } });
    if (!club) {
      throw new ErrorResponse(404, "Club not found");
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const userInClub = new UserInClub();
        userInClub.user = user;
        userInClub.club = club;
        club.users = [userInClub];
        await manager
          .getRepository(Club)
          .createQueryBuilder()
          .relation(Club, "users")
          .of(clubId)
          .add(userId);
        return userId;
      });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (userId: number, clubCreate: ClubCreate) => {
    // check if user exists
    const user = await this._userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }

    // check if category exists
    const category = await this._categoryRepository.findOne({
      where: { id: clubCreate.categories[0] },
    });
    if (!category) {
      throw new ErrorResponse(404, "Category not found");
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const club = ClubConverter.toEntityFromCreate(clubCreate);
        const userInClub = new UserInClub();
        userInClub.user = user;
        userInClub.club = club;
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
            throw new ErrorResponse(409, "Unique constraint error");
          }
          throw err;
        }
      });
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, clubUpdate: ClubUpdate) => {
    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const result = await manager
          .getRepository(Club)
          .save(ClubConverter.toEntityFromUpdate(id, clubUpdate));
        return result.id;
      });
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      await this._clubRepository.update(id, { deleted_at: new Date() });
      return id;
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
