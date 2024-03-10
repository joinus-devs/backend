import { DataSource, Repository } from "typeorm";
import Errors from "../constants/errors";
import { Role, User, UserConverter, UserDto, UserUpdate } from "../models";
import { TransactionManager } from "../modules";
import { CursorDto, Nullable } from "../types";

export interface IUserService {
  find(id: number): Promise<UserDto>;
  findAll(cursor?: number, limit?: number): Promise<CursorDto<UserDto[]>>;
  findAllByClub(
    clubId: number,
    roles?: Role | Role[],
    cursor?: number,
    limit?: number
  ): Promise<CursorDto<UserDto[]>>;
  update(id: number, userUpdate: UserUpdate): Promise<number>;
  delete(id: number): Promise<number>;
}

export class UserService implements IUserService {
  private static _instance: Nullable<UserService> = null;
  private _repository: Repository<User>;
  private _transactionManager: TransactionManager;

  private constructor(
    dataSoruce: DataSource,
    transactionManager: TransactionManager
  ) {
    this._transactionManager = transactionManager;
    this._repository = dataSoruce.getRepository(User);
  }

  static getInstance(
    dataSoruce: DataSource,
    transactionManager: TransactionManager
  ) {
    if (!this._instance) {
      this._instance = new UserService(dataSoruce, transactionManager);
    }

    return this._instance;
  }

  find = async (id: number) => {
    let user;
    try {
      user = await this._repository.findOne({ where: { id } });
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }

    // 유저가 없을 경우
    if (!user) {
      throw Errors.UserNotFound.clone();
    }

    return UserConverter.toDto(user);
  };

  findAll = async (cursor?: number, limit = 10) => {
    try {
      const users = await this._repository
        .createQueryBuilder("user")
        .where("user.deleted_at IS NULL")
        .andWhere(cursor ? "user.id < :cursor" : "1=1", { cursor })
        .orderBy("user.id", "DESC")
        .take(limit + 1)
        .getMany();
      const next = users.length > limit ? users[users.length - 2].id : null;
      return {
        data: users.slice(0, limit).map((user) => UserConverter.toDto(user)),
        next,
      };
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };

  findAllByClub = async (
    clubId: number,
    roles?: Role[],
    cursor?: number,
    limit = 10
  ) => {
    try {
      const users = await this._repository
        .createQueryBuilder("user")
        .leftJoin("user.clubs", "club", "club.deleted_at IS NULL")
        .addSelect("club.role", "user_role")
        .addSelect("club.exp", "user_exp")
        .where("club.club_id = :clubId", { clubId })
        .andWhere("user.deleted_at IS NULL")
        .andWhere(roles ? "club.role IN (:...roles)" : "1=1", { roles })
        .andWhere(cursor ? "user.id < :cursor" : "1=1", { cursor })
        .orderBy("user.id", "DESC")
        .take(limit + 1)
        .getMany();
      const next = users.length > limit ? users[users.length - 2].id : null;
      return {
        data: users.slice(0, limit).map((user) => UserConverter.toDto(user)),
        next,
      };
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };

  update = async (id: number, userUpdate: UserUpdate) => {
    try {
      const result = await this._repository.save(
        UserConverter.fromUpdate(id, userUpdate)
      );
      return result.id;
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };

  delete = async (id: number) => {
    try {
      await this._repository.update(id, { deleted_at: new Date() });
      return id;
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };
}
