import { NextFunction, Request, RequestHandler, Response } from "express";
import { CommentCreate } from "../models";
import { ICommentService } from "../services";
import {
  CursorQueryParams,
  IdPathParams,
  Nullable,
  QueryParser,
  SuccessResponse,
} from "../types";

export interface ICommentController {
  find: RequestHandler<IdPathParams>;
  findAllByFeed: RequestHandler<IdPathParams, void, void, CursorQueryParams>;
  create: RequestHandler<IdPathParams, CommentCreate>;
  update: RequestHandler;
  delete: RequestHandler;
}

export class CommentController implements ICommentController {
  private static _instance: Nullable<CommentController> = null;
  private _service: ICommentService;

  private constructor(service: ICommentService) {
    this._service = service;
  }

  static getInstance(service: ICommentService) {
    if (!this._instance) {
      this._instance = new CommentController(service);
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
      const comments = await this._service.find(id);
      res
        .status(200)
        .json(
          new SuccessResponse(comments, "해당 댓글을 불러왔습니다.").toDTO()
        );
    } catch (err) {
      next(err);
    }
  };

  findAllByFeed = async (
    req: Request<IdPathParams, void, void, CursorQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clubId = Number(req.params.id);
      const feeds = await this._service.findAllByFeed(
        clubId,
        ...QueryParser.parseCursorQueries(req)
      );
      res
        .status(200)
        .json(
          new SuccessResponse(
            feeds,
            "해당 피드의 모든 댓글을 불러왔습니다."
          ).toDTO()
        );
    } catch (err) {
      next(err);
    }
  };

  create = async (
    req: Request<IdPathParams, CommentCreate>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any)?.decoded?.id;
      const feedId = Number(req.params.id);
      const commentCreate = req.body;
      const commentId = await this._service.create(
        userId,
        feedId,
        commentCreate
      );
      res
        .status(200)
        .json(new SuccessResponse(commentId, "댓글이 등록되었습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const commentUpdate = req.body;
      const commentId = await this._service.update(id, commentUpdate);
      res
        .status(200)
        .json(new SuccessResponse(commentId, "댓글이 수정되었습니다.").toDTO());
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
        .json(new SuccessResponse(deletedId, "댓글이 삭제되었습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };
}
