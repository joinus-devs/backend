import { UserCreate, UserUpdate } from "../models";
import { UserRepository } from "../repositories";
import { Nullable } from "../types";

class UserService {
  private static _instance: Nullable<UserService> = null;
  private _repository: UserRepository;

  private constructor(repository: UserRepository) {
    this._repository = repository;
  }

  static getInstance(repository: UserRepository) {
    if (!this._instance) {
      this._instance = new UserService(repository);
    }

    return this._instance;
  }

  find = async (id: number) => {
    try {
      const user = await this._repository.find(id);
      return user;
    } catch (err) {
      throw new Error("Internal Server Error");
    }
  };

  findAll = async () => {
    try {
      const users = await this._repository.findAll();
      return users;
    } catch (err) {
      throw new Error("Internal Server Error");
    }
  };

  create = async (userCreate: UserCreate) => {
    try {
      const user = await this._repository.create(userCreate);
      return user;
    } catch (err) {
      throw new Error("Internal Server Error");
    }
  };

  update = async (id: number, userUpdate: UserUpdate) => {
    try {
      const user = await this._repository.update(id, userUpdate);
      return user;
    } catch (err) {
      throw new Error("Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      const user = await this._repository.delete(id);
      return user;
    } catch (err) {
      throw new Error("Internal Server Error");
    }
  };
}

export default UserService;
