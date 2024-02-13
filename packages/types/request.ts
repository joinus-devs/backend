import { Request } from "express";

export interface IdPathParams {
  id: number;
}

export interface PageQueryParams {
  page: number;
  limit: number;
}

export interface CursorQueryParams {
  cursor?: number;
  limit?: number;
}

export class QueryParser {
  static getCursorQuery(req: Request<any, any, any, CursorQueryParams>) {
    return [
      req.query.cursor ? Number(req.query.cursor) : undefined,
      req.query.limit ? Number(req.query.limit) : undefined,
    ];
  }
}
