import {
  ClubCategory,
  ClubConverter,
  ClubCreate,
  ClubDto,
  ClubUpdate,
} from "../models";
import { UserInClub } from "../models/userInClub";
import { TransactionManager } from "../modules";
import {
  ICategoryRepository,
  IClubRepository,
  IUserRepository,
} from "../repositories";
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
  private _clubRepository: IClubRepository;
  private _userRepository: IUserRepository;
  private _categoryRepository: ICategoryRepository;

  private constructor(
    transactionManager: TransactionManager,
    clubRepository: IClubRepository,
    userRepository: IUserRepository,
    categoryRepository: ICategoryRepository
  ) {
    this._transactionManager = transactionManager;
    this._clubRepository = clubRepository;
    this._userRepository = userRepository;
    this._categoryRepository = categoryRepository;
  }

  static getInstance(
    transactionManager: TransactionManager,
    clubRepository: IClubRepository,
    userRepository: IUserRepository,
    categoryRepository: ICategoryRepository
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
      club = await this._clubRepository.find(id);
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
      const clubs = await this._clubRepository.findAll();
      return clubs.map((club) => ClubConverter.toDto(club));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  findAllByUser = async (userId: number) => {
    try {
      const clubs = await this._clubRepository.findAllByUser(userId);
      return clubs.map((club) => ClubConverter.toDto(club));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  findAllByCategory = async (categoryId: number) => {
    try {
      const clubs = await this._clubRepository.findAllByCategory(categoryId);
      return clubs.map((club) => ClubConverter.toDto(club));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  join = async (userId: number, clubId: number) => {
    // check if user exists
    const user = await this._userRepository.find(userId);
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }

    // check if club exists
    const club = await this._clubRepository.find(clubId);
    if (!club) {
      throw new ErrorResponse(404, "Club not found");
    }

    try {
      return this._transactionManager.withTransaction(async () => {
        const userInClub = new UserInClub();
        userInClub.user = user;
        userInClub.club = club;
        club.users = [userInClub];
        return await this._clubRepository.createUser(clubId, userId);
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
    const user = await this._userRepository.find(userId);
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }

    // check if category exists
    const categories = await this._categoryRepository.find(
      clubCreate.categories[0]
    );
    if (!categories) {
      throw new ErrorResponse(404, "Category not found");
    }

    try {
      return this._transactionManager.withTransaction(async () => {
        const club = ClubConverter.toEntityFromCreate(clubCreate);
        const userInClub = new UserInClub();
        userInClub.user = user;
        userInClub.club = club;
        club.users = [userInClub];
        const clubCategory = new ClubCategory();
        clubCategory.club = club;
        clubCategory.category = categories;
        club.categories = [clubCategory];
        return await this._clubRepository.create(club);
      });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, clubUpdate: ClubUpdate) => {
    try {
      return await this._clubRepository.update(
        ClubConverter.toEntityFromUpdate(id, clubUpdate)
      );
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      return await this._clubRepository.delete(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
