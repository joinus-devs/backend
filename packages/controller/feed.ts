import { NextFunction, Request, RequestHandler, Response } from "express";
import { IFeedService } from "../services";
import {
  CursorQueryParams,
  ErrorResponse,
  IdPathParams,
  Nullable,
  QueryParser,
  SuccessResponse,
} from "../types";

export interface IFeedController {
  find: RequestHandler<IdPathParams>;
  findAll: RequestHandler<unknown, void, void, CursorQueryParams>;
  findAllByClub: RequestHandler<IdPathParams, void, void, CursorQueryParams>;
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
    req: Request<IdPathParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const feed = await this._service.find(id);
      res
        .status(200)
        .json(new SuccessResponse(feed, "해당 피드를 불러왔습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  findAll = async (
    req: Request<unknown, void, void, CursorQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const feeds = await this._service.findAll(
        ...QueryParser.parseCursorQueries(req)
      );
      res
        .status(200)
        .json(new SuccessResponse(feeds, "모든 피드를 불러왔습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  findAllByClub = async (
    req: Request<IdPathParams, void, void, CursorQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clubId = Number(req.params.id);
      const feeds = await this._service.findAllByClub(
        clubId,
        ...QueryParser.parseCursorQueries(req)
      );
      res
        .status(200)
        .json(
          new SuccessResponse(
            feeds,
            "해당 클럽의 모든 피드를 불러왔습니다."
          ).toDTO()
        );
    } catch (err) {
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
        .status(200)
        .json(new SuccessResponse(feedId, "피드가 생성되었습니다.").toDTO());
    } catch (err) {
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
        .json(new SuccessResponse(feedId, "피드가 수정되었습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const deletedId = await this._service.delete(id);
      res
        .status(200)
        .json(new SuccessResponse(deletedId, "피드가 삭제되었습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };
}
