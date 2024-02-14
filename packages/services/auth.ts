import { DataSource, Repository } from "typeorm";
import Errors from "../constants/errors";
import { SigninParams, User } from "../models";
import { TransactionManager } from "../modules";
import { Nullable } from "../types";

export interface IAuthService {
  me: (id: number) => Promise<User>;
  signin(params: SigninParams): Promise<User>;
}

export class AuthService implements IAuthService {
  private static _instance: Nullable<AuthService> = null;
  private _transactionManager: TransactionManager;
  private _repository: Repository<User>;

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
      this._instance = new AuthService(dataSoruce, transactionManager);
    }

    return this._instance;
  }

  me = async (id: number) => {
    let user;
    try {
      user = await this._repository.findOne({ where: { id } });
    } catch (err) {
      throw Errors.InternalServerError;
    }

    if (!user) {
      throw Errors.UserNotFound;
    }

    return user;
  };

  signin = async (params: SigninParams) => {
    let user;
    try {
      user = await this._repository.findOne({ where: { email: params.email } });
    } catch (err) {
      throw Errors.InternalServerError;
    }

    if (!user) {
      throw Errors.UserNotFound;
    }
    if (user.password !== params.password) {
      throw Errors.PasswordNotMatch;
    }

    return user;
  };
}
