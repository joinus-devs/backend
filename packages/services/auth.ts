import { SigninParams, User } from "../models";
import { IUserRepository } from "../repositories";
import { ErrorResponse, Nullable } from "../types";

export interface IAuthService {
  me: (id: number) => Promise<User>;
  signin(params: SigninParams): Promise<User>;
}

export class AuthService implements IAuthService {
  private static _instance: Nullable<AuthService> = null;
  private _repository: IUserRepository;

  private constructor(repository: IUserRepository) {
    this._repository = repository;
  }

  static getInstance(repository: IUserRepository) {
    if (!this._instance) {
      this._instance = new AuthService(repository);
    }

    return this._instance;
  }

  me = async (id: number) => {
    let user;
    try {
      user = await this._repository.find(id);
      if (!user) {
        throw new ErrorResponse(404, "User not found");
      }
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
    return user;
  };

  signin = async (params: SigninParams) => {
    let user;
    try {
      user = await this._repository.findByEmail(params.email);
      if (!user) {
        throw new ErrorResponse(404, "User not found");
      }
      if (user.password !== params.password) {
        throw new ErrorResponse(401, "Invalid password");
      }
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
    return user;
  };
}
