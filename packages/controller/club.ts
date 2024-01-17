import { NextFunction, Request, RequestHandler, Response } from "express";
import { IClubService } from "../services/club";
import { ErrorResponse, Nullable, SuccessResponse } from "../types";

export interface IClubController {
  find: RequestHandler;
  findAll: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}

export class ClubController implements IClubController {
  private static _instance: Nullable<ClubController> = null;
  private _service: IClubService;

  private constructor(service: IClubService) {
    this._service = service;
  }

  static getInstance(service: IClubService) {
    if (!this._instance) {
      this._instance = new ClubController(service);
    }

    return this._instance;
  }

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await this._service.find(id);
      res
        .status(200)
        .json(new SuccessResponse(user, "Club retrieved successfully").toDTO());
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
        .json(
          new SuccessResponse(users, "Clubs retrieved successfully").toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCreate = req.body;
      const user = await this._service.create(userCreate);
      res
        .status(201)
        .json(new SuccessResponse(user, "Club created successfully").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const userUpdate = req.body;
      const user = await this._service.update(id, userUpdate);
      res
        .status(200)
        .json(new SuccessResponse(user, "Club updated successfully").toDTO());
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
        .json(
          new SuccessResponse(deletedId, "Club deleted successfully").toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };
}
