import { UserCreate, UserDto, UserUpdate } from "../models";
import { IUserRepository } from "../repositories";
import { ErrorResponse, Maybe, Nullable } from "../types";

export interface IUserService {
  find(id: number): Promise<Nullable<UserDto>>;
  findAll(): Promise<UserDto[]>;
  create(userCreate: UserCreate): Promise<Nullable<UserDto>>;
  update(id: number, userUpdate: UserUpdate): Promise<Nullable<UserDto>>;
  delete(id: number): Promise<Maybe<number>>;
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
    return user.toDto();
  };

  findAll = async () => {
    try {
      const users = await this._repository.findAll();
      return users;
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (userCreate: UserCreate) => {
    try {
      const user = await this._repository.create(userCreate);
      return user;
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, userUpdate: UserUpdate) => {
    try {
      const user = await this._repository.update(id, userUpdate);
      return user;
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      const deletedId = await this._repository.delete(id);
      return deletedId;
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
