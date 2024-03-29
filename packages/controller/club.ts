import { NextFunction, Request, RequestHandler, Response } from "express";
import { ClubCreate, ClubUpdate, Role } from "../models";
import { IClubService } from "../services";
import {
  CursorQueryParams,
  ErrorResponse,
  IdPathParams,
  Nullable,
  QueryParser,
  SuccessResponse,
} from "../types";

export interface UserSetRole {
  role: Role;
}

export interface IClubController {
  find: RequestHandler<IdPathParams>;
  findAll: RequestHandler<void, void, void, CursorQueryParams>;
  findAllByUser: RequestHandler<IdPathParams, void, void, CursorQueryParams>;
  findAllByCategory: RequestHandler<
    IdPathParams,
    void,
    void,
    CursorQueryParams
  >;
  join: RequestHandler<IdPathParams>;
  reject: RequestHandler<IdPathParams & { userId: number }>;
  setRole: RequestHandler<IdPathParams & { userId: number }, UserSetRole>;
  create: RequestHandler<unknown, ClubCreate>;
  update: RequestHandler<IdPathParams, ClubUpdate>;
  delete: RequestHandler<IdPathParams, void>;
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
    req: Request<IdPathParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const club = await this._service.find(id);
      res
        .status(200)
        .json(new SuccessResponse(club, "해당 클럽을 불러왔습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  findAll = async (
    req: Request<void, void, void, CursorQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clubs = await this._service.findAll(
        ...QueryParser.parseCursorQueries(req)
      );
      res
        .status(200)
        .json(
          new SuccessResponse(clubs, "모든 클럽들을 불러왔습니다.").toDTO()
        );
    } catch (err) {
      next(err);
    }
  };

  findAllByUser = async (
    req: Request<IdPathParams, void, void, CursorQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = Number(req.params.id);
      const clubs = await this._service.findAllByUser(
        userId,
        ...QueryParser.parseCursorQueries(req)
      );
      res
        .status(200)
        .json(
          new SuccessResponse(
            clubs,
            "해당 유저의 클럽들을 불러왔습니다."
          ).toDTO()
        );
    } catch (err) {
      next(err);
    }
  };

  findAllByCategory = async (
    req: Request<IdPathParams, void, void, CursorQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categoryId = Number(req.params.id);
      const clubs = await this._service.findAllByCategory(
        categoryId,
        ...QueryParser.parseCursorQueries(req)
      );
      res
        .status(200)
        .json(
          new SuccessResponse(
            clubs,
            "해당 카테고리의 클럽들을 불러왔습니다."
          ).toDTO()
        );
    } catch (err) {
      next(err);
    }
  };

  join = async (
    req: Request<IdPathParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any)?.decoded?.id;
      const clubId = Number(req.params.id);
      await this._service.join(userId, clubId);
      res
        .status(200)
        .json(
          new SuccessResponse(
            null,
            `${userId}번 유저가 ${clubId}번 클럽에 가입되었습니다.`
          ).toDTO()
        );
    } catch (err) {
      next(err);
    }
  };

  reject = async (
    req: Request<IdPathParams & { userId: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const requesterId = (req as any)?.decoded?.id;
      const clubId = Number(req.params.id);
      const userId = Number(req.params.userId);
      await this._service.reject(requesterId, clubId, userId);
      res
        .status(200)
        .json(
          new SuccessResponse(
            null,
            `${userId}번 유저의 ${clubId}번 클럽 가입 요청이 거절되었습니다.`
          ).toDTO()
        );
    } catch (err) {
      next(err);
    }
  };

  setRole = async (
    req: Request<IdPathParams & { userId: number }, UserSetRole>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const requesterId = (req as any)?.decoded?.id;
      const clubId = Number(req.params.id);
      const userId = Number(req.params.userId);
      const role = req.body.role;
      await this._service.setRole(requesterId, clubId, userId, role);
      res
        .status(200)
        .json(
          new SuccessResponse(userId, "유저의 역할이 변경되었습니다.").toDTO()
        );
    } catch (err) {
      next(err);
    }
  };

  create = async (
    req: Request<unknown, ClubCreate>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any)?.decoded?.id;
      const clubCreate = req.body;
      const clubId = await this._service.create(userId, clubCreate);
      res
        .status(200)
        .json(new SuccessResponse(clubId, "클럽이 생성되었습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  update = async (
    req: Request<IdPathParams, ClubUpdate>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const clubUpdate = req.body;
      const clubId = await this._service.update(id, clubUpdate);
      res
        .status(200)
        .json(new SuccessResponse(clubId, "클럽이 수정되었습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };

  delete = async (
    req: Request<IdPathParams, void>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const deletedId = await this._service.delete(id);
      res
        .status(200)
        .json(new SuccessResponse(deletedId, "클럽이 삭제되었습니다.").toDTO());
    } catch (err) {
      next(err);
    }
  };
}
