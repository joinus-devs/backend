import { DataSource, QueryFailedError, Repository } from "typeorm";
import Errors from "../constants/errors";
import {
  SigninParams,
  SigninSocialParams,
  SignupParams,
  SignupSocialParams,
  User,
  UserConverter,
} from "../models";
import { TransactionManager } from "../modules";
import { Nullable } from "../types";
import { CheckEmailParams } from "./../models/auth";

export interface IAuthService {
  me: (id: number) => Promise<User>;
  signin(params: SigninParams): Promise<User>;
  signup(userCreate: SignupParams): Promise<number>;
  signinSocial(params: SigninSocialParams): Promise<User>;
  signupSocial(params: SignupSocialParams): Promise<number>;
  checkEmail(email: CheckEmailParams): Promise<boolean>;
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

  signup = async (userCreate: SignupParams) => {
    try {
      const result = await this._repository.save(
        UserConverter.fromSignup(userCreate)
      );
      return result.id;
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.errno === 1062) {
        throw Errors.UserNameAlreadyExists;
      }
      throw Errors.makeInternalServerError(err);
    }
  };

  signinSocial = async (params: SigninSocialParams) => {
    let user;
    try {
      user = await this._repository.findOne({
        where: { social_id: params.social_id, type: params.type },
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }

    if (!user) {
      throw Errors.UserNotFound;
    }

    return user;
  };

  signupSocial = async (params: SignupSocialParams) => {
    try {
      const result = await this._repository.save(
        UserConverter.fromSignupSocial(params)
      );
      return result.id;
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.errno === 1062) {
        throw Errors.UserNameAlreadyExists;
      }
      throw Errors.InternalServerError;
    }
  };

  checkEmail = async ({ email }: CheckEmailParams) => {
    let user;
    try {
      user = await this._repository.findOne({ where: { email } });
    } catch (err) {
      throw Errors.InternalServerError;
    }

    if (!user) {
      return true;
    }

    throw Errors.UserEmailAlreadyExists;
  };
}
