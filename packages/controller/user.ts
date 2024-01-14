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

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await this._service.find(id);
      res
        .status(200)
        .json(new SuccessResponse(user, "User retrieved successfully").toDTO());
    } catch (err) {
      if (!(err instanceof Error)) return;
      next(new ErrorResponse(500, err.message));
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this._service.findAll();
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

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCreate = req.body;
      const user = await this._service.create(userCreate);
      res
        .status(201)
        .json(new SuccessResponse(user, "User created successfully").toDTO());
    } catch (err) {
      if (!(err instanceof Error)) return;
      next(new ErrorResponse(500, err.message));
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const userUpdate = req.body;
      const user = await this._service.update(id, userUpdate);
      res
        .status(200)
        .json(new SuccessResponse(user, "User updated successfully").toDTO());
    } catch (err) {
      if (!(err instanceof Error)) return;
      next(new ErrorResponse(500, err.message));
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this._service.delete(id);
      res
        .status(200)
        .json(new SuccessResponse(null, "User deleted successfully").toDTO());
    } catch (err) {
      if (!(err instanceof Error)) return;
      next(new ErrorResponse(500, err.message));
    }
  };
}

export default UserController;
