import { NextFunction, Request, RequestHandler, Response } from "express";
import { IClubChatService } from "../services";
import {
  CursorQueryParams,
  IdPathParams,
  Nullable,
  QueryParser,
  SuccessResponse,
} from "../types";

export interface IClubChatController {
  findAllByClub: RequestHandler<IdPathParams, void, void, CursorQueryParams>;
}

export class ClubChatController implements IClubChatController {
  private static _instance: Nullable<ClubChatController> = null;
  private _service: IClubChatService;

  private constructor(service: IClubChatService) {
    this._service = service;
  }

  static getInstance(service: IClubChatService) {
    if (!this._instance) {
      this._instance = new ClubChatController(service);
    }

    return this._instance;
  }

  findAllByClub = async (
    req: Request<IdPathParams, void, void, CursorQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clubId = Number(req.params.id);
      const clubChats = await this._service.findAllByClub(
        clubId,
        ...QueryParser.parseCursorQueries(req)
      );
      res
        .status(200)
        .json(
          new SuccessResponse(
            clubChats,
            "해당 클럽의 모든 채팅을 조회했습니다."
          ).toDTO()
        );
    } catch (err) {
      next(err);
    }
  };
}
