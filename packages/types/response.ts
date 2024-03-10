import { Nullable } from "../types";

export class SuccessResponse<T> {
  private _status: number;
  private _code: number;
  private _data: Nullable<T>;
  private _message: string;

  constructor(data: Nullable<T>, message: string) {
    this._status = 200;
    this._code = 20000;
    this._data = data;
    this._message = message;
  }

  toDTO() {
    return {
      status: this._status,
      code: this._code,
      data: this._data,
      message: this._message,
    };
  }
}

export class ErrorResponse extends Error {
  private _status: number;
  private _code: number;
  private _data: Nullable<object> = null;
  private _message: string;

  constructor(
    status: number,
    code: number,
    message: string,
    data?: Nullable<object>
  ) {
    super(message);
    this._status = status;
    this._code = code;
    this._data = data ?? null;
    this._message = message;
  }

  get status() {
    return this._status;
  }

  clone(message?: string) {
    return new ErrorResponse(
      this._status,
      this._code,
      `${this._message} ${message ?? ""}`,
      this._data
    );
  }

  toDTO() {
    return {
      status: this._status,
      code: this._code,
      data: this._data,
      message: this._message,
    };
  }
}

export interface CursorDto<T, S = number> {
  next: Nullable<S>;
  data: T;
}
