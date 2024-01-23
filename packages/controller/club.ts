import { NextFunction, Request, RequestHandler, Response } from "express";
import { IClubService } from "../services";
import {
  ErrorResponse,
  IdQueryParams,
  Nullable,
  PageQueryParams,
  SuccessResponse,
} from "../types";

export interface IClubController {
  find: RequestHandler<IdQueryParams>;
  findAll: RequestHandler<PageQueryParams>;
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

  find = async (
    req: Request<IdQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const club = await this._service.findWithUsers(id);
      res
        .status(200)
        .json(new SuccessResponse(club, "Club retrieved successfully").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  findAll = async (
    req: Request<PageQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clubs = await this._service.findAll();
      res
        .status(200)
        .json(
          new SuccessResponse(clubs, "Clubs retrieved successfully").toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubCreate = req.body;
      const club = await this._service.create(clubCreate);
      res
        .status(201)
        .json(new SuccessResponse(club, "Club created successfully").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const clubUpdate = req.body;
      const club = await this._service.update(id, clubUpdate);
      res
        .status(200)
        .json(new SuccessResponse(club, "Club updated successfully").toDTO());
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
