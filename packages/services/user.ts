import { Repository } from "typeorm";
import {
  User,
  UserConverter,
  UserCreate,
  UserDto,
  UserUpdate,
} from "../models";
import { TransactionManager } from "../modules";
import { ErrorResponse, Nullable } from "../types";

export interface IUserService {
  find(id: number): Promise<UserDto>;
  findAll(): Promise<UserDto[]>;
  findAllByClub(clubId: number): Promise<UserDto[]>;
  create(userCreate: UserCreate): Promise<number>;
  update(id: number, userUpdate: UserUpdate): Promise<number>;
  delete(id: number): Promise<number>;
}

export class UserService implements IUserService {
  private static _instance: Nullable<UserService> = null;
  private _repository: Repository<User>;
  private _transactionManager: TransactionManager;

  private constructor(
    transactionManager: TransactionManager,
    repository: Repository<User>
  ) {
    this._repository = repository;
    this._transactionManager = transactionManager;
  }

  static getInstance(
    transactionManager: TransactionManager,
    repository: Repository<User>
  ) {
    if (!this._instance) {
      this._instance = new UserService(transactionManager, repository);
    }

    return this._instance;
  }

  find = async (id: number) => {
    let user;
    try {
      user = await this._repository.findOne({ where: { id } });
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }

    // check if user exists
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }

    return UserConverter.toDto(user);
  };

  findAll = async () => {
    try {
      const users = await this._repository.find();
      return users.map((user) => UserConverter.toDto(user));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  findAllByClub = async (clubId: number) => {
    try {
      const users = await this._repository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.clubs", "userInClub")
        .leftJoinAndSelect("userInClub.club", "club")
        .where("club.id = :id", { id: clubId, deleted_at: undefined })
        .getMany();
      return users.map((user) => UserConverter.toDto(user));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (userCreate: UserCreate) => {
    try {
      const result = await this._repository.save(
        UserConverter.toEntityFromCreate(userCreate)
      );
      return result.id;
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, userUpdate: UserUpdate) => {
    try {
      const result = await this._repository.save(
        UserConverter.toEntityFromUpdate(id, userUpdate)
      );
      return result.id;
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      await this._repository.update(id, { deleted_at: new Date() });
      return id;
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
