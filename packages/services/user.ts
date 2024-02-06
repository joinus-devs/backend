import { Repository } from "typeorm";
import Errors from "../constants/errors";
import {
  Role,
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
  findAllByClub(clubId: number, roles?: Role | Role[]): Promise<UserDto[]>;
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
      throw Errors.InternalServerError;
    }

    // 유저가 없을 경우
    if (!user) {
      throw Errors.UserNotFound;
    }

    return UserConverter.toDto(user);
  };

  findAll = async () => {
    try {
      const users = await this._repository.find();
      return users.map((user) => UserConverter.toDto(user));
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  findAllByClub = async (clubId: number, roles?: Role[]) => {
    try {
      const users = await this._repository
        .createQueryBuilder("user")
        .leftJoin("user.clubs", "club", "club.deleted_at IS NULL")
        .addSelect("club.role", "user_role")
        .addSelect("club.exp", "user_exp")
        .where("club.club_id = :clubId", { clubId })
        .andWhere("user.deleted_at IS NULL")
        .andWhere(roles ? "club.role IN (:...roles)" : "1=1", { roles })
        .getMany();
      return users.map((user) => UserConverter.toInClubDto(user));
    } catch (err) {
      console.log(err);
      throw Errors.InternalServerError;
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
      throw Errors.InternalServerError;
    }
  };

  update = async (id: number, userUpdate: UserUpdate) => {
    try {
      const result = await this._repository.save(
        UserConverter.toEntityFromUpdate(id, userUpdate)
      );
      return result.id;
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  delete = async (id: number) => {
    try {
      await this._repository.update(id, { deleted_at: new Date() });
      return id;
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };
}
