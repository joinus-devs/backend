import { Nullable } from "../types";

export class SuccessResponse<T> {
  private _status: number;
  private _data: Nullable<T>;
  private _message: string;

  constructor(data: Nullable<T>, message: string) {
    this._status = 200;
    this._data = data;
    this._message = message;
  }

  toDTO() {
    return {
      status: this._status,
      data: this._data,
      message: this._message,
    };
  }
}

export class ErrorResponse extends Error {
  private _status: number;
  private _message: string;
  private _data: Nullable<object> = null;

  constructor(status: number, message: string, data?: object) {
    super(message);
    this._status = status;
    this._message = message;
    this._data = data ?? null;
  }

  get status() {
    return this._status;
  }

  toDTO() {
    return {
      status: this._status,
      data: this._data,
      message: this._message,
    };
  }
}
