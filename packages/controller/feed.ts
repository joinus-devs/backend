import { NextFunction, Request, RequestHandler, Response } from "express";
import { IFeedService } from "../services";
import {
  ErrorResponse,
  IdQueryParams,
  Nullable,
  PageQueryParams,
  SuccessResponse,
} from "../types";

export interface IFeedController {
  find: RequestHandler<IdQueryParams>;
  findAll: RequestHandler<PageQueryParams>;
  findAllByClub: RequestHandler<IdQueryParams>;
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}

export class FeedController implements IFeedController {
  private static _instance: Nullable<FeedController> = null;
  private _service: IFeedService;

  private constructor(service: IFeedService) {
    this._service = service;
  }

  static getInstance(service: IFeedService) {
    if (!this._instance) {
      this._instance = new FeedController(service);
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
      const feed = await this._service.find(id);
      res
        .status(200)
        .json(new SuccessResponse(feed, "Club retrieved successfully").toDTO());
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
      const feeds = await this._service.findAll();
      res
        .status(200)
        .json(
          new SuccessResponse(feeds, "Feeds retrieved successfully").toDTO()
        );
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
          new SuccessResponse(feeds, "Feeds retrieved successfully").toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any)?.decoded?.id;
      const clubId = Number(req.params.id);
      const feedCreate = req.body;
      const feedId = await this._service.create(userId, clubId, feedCreate);
      res
        .status(201)
        .json(new SuccessResponse(feedId, "Feed created successfully").toDTO());
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const feedUpdate = req.body;
      const feedId = await this._service.update(id, feedUpdate);
      res
        .status(200)
        .json(new SuccessResponse(feedId, "Feed updated successfully").toDTO());
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
          new SuccessResponse(deletedId, "Feed deleted successfully").toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };
}
