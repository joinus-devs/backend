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
