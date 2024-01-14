import { NextFunction, Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../models/response";
import { UserService } from "../services";
import { Nullable } from "../types";

class UserController {
  private static _instance: Nullable<UserController> = null;
  private _service: UserService;

  private constructor(service: UserService) {
    this._service = service;
  }

  static getInstance(service: UserService) {
    if (!this._instance) {
      this._instance = new UserController(service);
    }

    return this._instance;
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this._service.getUsers();
      res
        .status(200)
        .json(
          new SuccessResponse(users, "Users retrieved successfully").toDTO()
        );
    } catch (err) {
      if (!(err instanceof Error)) return;
      next(new ErrorResponse(500, err.message));
    }
  };
}

export default UserController;
