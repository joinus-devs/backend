import { UserConverter, UserCreate, UserDto, UserUpdate } from "../models";
import { IUserRepository } from "../repositories";
import { ErrorResponse, Nullable } from "../types";

export interface IUserService {
  find(id: number): Promise<Nullable<UserDto>>;
  findAll(): Promise<UserDto[]>;
  create(userCreate: UserCreate): Promise<number>;
  update(id: number, userUpdate: UserUpdate): Promise<number>;
  delete(id: number): Promise<number>;
}

export class UserService implements IUserService {
  private static _instance: Nullable<UserService> = null;
  private _repository: IUserRepository;

  private constructor(repository: IUserRepository) {
    this._repository = repository;
  }

  static getInstance(repository: IUserRepository) {
    if (!this._instance) {
      this._instance = new UserService(repository);
    }

    return this._instance;
  }

  find = async (id: number) => {
    let user;
    try {
      user = await this._repository.find(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }
    return UserConverter.toDto(user);
  };

  findAll = async () => {
    try {
      const users = await this._repository.findAll();
      return users.map((user) => UserConverter.toDto(user));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (userCreate: UserCreate) => {
    try {
      return await this._repository.create(
        UserConverter.toEntityFromCreate(userCreate)
      );
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, userUpdate: UserUpdate) => {
    try {
      return await this._repository.update(
        UserConverter.toEntityFromUpdate(id, userUpdate)
      );
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      return await this._repository.delete(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
