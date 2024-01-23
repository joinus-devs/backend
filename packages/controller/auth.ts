import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { SigninParams, UserCreate } from "../models";
import { IAuthService, IUserService } from "../services";
import { ErrorResponse, Nullable, SuccessResponse } from "../types";

export interface IAuthController {
  me: RequestHandler;
  signin: RequestHandler<{}, any, SigninParams>;
  signup: RequestHandler<{}, any, UserCreate>;
}

export class AuthController implements IAuthController {
  private static _instance: Nullable<AuthController> = null;
  private _authService: IAuthService;
  private _userService: IUserService;

  private constructor(authService: IAuthService, userService: IUserService) {
    this._authService = authService;
    this._userService = userService;
  }

  static getInstance(authService: IAuthService, userService: IUserService) {
    if (!this._instance) {
      this._instance = new AuthController(authService, userService);
    }

    return this._instance;
  }

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this._authService.me((req as any)?.decoded?.id);
      res.status(200).json(new SuccessResponse(user, "Success").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
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
        throw new ErrorResponse(500, "Internal Server Error");
      }
      res
        .status(201)
        .json(new SuccessResponse({ token }, "Signin successfully").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  signup = async (
    req: Request<{}, any, UserCreate>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userCreate = req.body;
      const user = await this._userService.create(userCreate);
      res
        .status(201)
        .json(new SuccessResponse(user, "User created successfully").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };
}
