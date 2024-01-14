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

  getUsers = async () => {
    try {
      const users = await this._repository.getUsers();
      return users;
    } catch (err) {
      throw new Error("Internal Server Error");
    }
  };
}

export default UserService;
