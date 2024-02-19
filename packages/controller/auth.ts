import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import Errors from "../constants/errors";
import {
  SigninParams,
  SigninSocialParams,
  SignupParams,
  SignupSocialParams,
} from "../models";
import { IAuthService } from "../services";
import { Nullable, SuccessResponse } from "../types";

export interface IAuthController {
  me: RequestHandler;
  signin: RequestHandler<{}, any, SigninParams>;
  signinSocial: RequestHandler<{}, any, SigninSocialParams>;
  signup: RequestHandler<{}, any, SignupParams>;
  signupSocial: RequestHandler<{}, any, SignupSocialParams>;
}

export class AuthController implements IAuthController {
  private static _instance: Nullable<AuthController> = null;
  private _authService: IAuthService;

  private constructor(authService: IAuthService) {
    this._authService = authService;
  }

  static getInstance(authService: IAuthService) {
    if (!this._instance) {
      this._instance = new AuthController(authService);
    }

    return this._instance;
  }

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this._authService.me((req as any)?.decoded?.id);
      res
        .status(200)
        .json(new SuccessResponse(user, "내 정보를 불러왔습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  signin = async (
    req: Request<{}, any, SigninParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const signinParams = req.body;
      const user = await this._authService.signin(signinParams);
      let token;
      try {
        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });
      } catch (err) {
        throw Errors.InternalServerError;
      }
      res
        .status(200)
        .json(new SuccessResponse({ token }, "로그인에 성공했습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  signinSocial = async (
    req: Request<{}, any, SigninSocialParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const signinSocialParams = req.body;
      const user = await this._authService.signinSocial(signinSocialParams);
      let token;
      try {
        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });
      } catch (err) {
        throw Errors.InternalServerError;
      }
      res
        .status(200)
        .json(new SuccessResponse({ token }, "로그인에 성공했습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  signup = async (
    req: Request<{}, any, SignupParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const signupParams = req.body;
      const userId = await this._authService.signup(signupParams);
      res
        .status(200)
        .json(new SuccessResponse(userId, "회원가입에 성공했습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  signupSocial = async (
    req: Request<{}, any, SignupSocialParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const signupSocialParams = req.body;
      const userId = await this._authService.signupSocial(signupSocialParams);
      res
        .status(200)
        .json(new SuccessResponse(userId, "회원가입에 성공했습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };
}
