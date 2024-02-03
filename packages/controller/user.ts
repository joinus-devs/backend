import { NextFunction, Request, RequestHandler, Response } from "express";
import { IUserService } from "../services";
import {
  ErrorResponse,
  IdQueryParams,
  Nullable,
  SuccessResponse,
} from "../types";

export interface IUserController {
  find: RequestHandler;
  findAll: RequestHandler;
  findAllByClub: RequestHandler<IdQueryParams>;
  update: RequestHandler;
  delete: RequestHandler;
}

export class UserController implements IUserController {
  private static _instance: Nullable<UserController> = null;
  private _service: IUserService;

  private constructor(service: IUserService) {
    this._service = service;
  }

  static getInstance(service: IUserService) {
    if (!this._instance) {
      this._instance = new UserController(service);
    }

    return this._instance;
  }

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await this._service.find(id);
      res
        .status(200)
        .json(new SuccessResponse(user, "유저를 불러왔습니다.").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this._service.findAll();
      res
        .status(200)
        .json(new SuccessResponse(users, "모든 유저를 불러왔습니다.").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  findAllByClub = async (
    req: Request<IdQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clubId = Number(req.params.id);
      const feeds = await this._service.findAllByClub(clubId);
      res
        .status(200)
        .json(
          new SuccessResponse(
            feeds,
            "해당 클럽의 유저들을 불러왔습니다."
          ).toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const userUpdate = req.body;
      const userId = await this._service.update(id, userUpdate);
      res
        .status(200)
        .json(
          new SuccessResponse(userId, "유저 정보가 수정되었습니다.").toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const deletedId = await this._service.delete(id);
      res
        .status(200)
        .json(new SuccessResponse(deletedId, "유저가 삭제되었습니다.").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };
}
