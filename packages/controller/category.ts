import { NextFunction, Request, RequestHandler, Response } from "express";
import { ICategoryService } from "../services";
import {
  ErrorResponse,
  IdQueryParams,
  Nullable,
  PageQueryParams,
  SuccessResponse,
} from "../types";

export interface ICategoryController {
  find: RequestHandler<IdQueryParams>;
  findAll: RequestHandler<PageQueryParams>;
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}

export class CategoryController implements ICategoryController {
  private static _instance: Nullable<CategoryController> = null;
  private _service: ICategoryService;

  private constructor(service: ICategoryService) {
    this._service = service;
  }

  static getInstance(service: ICategoryService) {
    if (!this._instance) {
      this._instance = new CategoryController(service);
    }

    return this._instance;
  }

  find = async (
    req: Request<IdQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const feed = await this._service.find(id);
      res
        .status(200)
        .json(
          new SuccessResponse(feed, "Comment retrieved successfully").toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  findAll = async (
    req: Request<PageQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const feeds = await this._service.findAll();
      res
        .status(200)
        .json(
          new SuccessResponse(feeds, "Comments retrieved successfully").toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryCreate = req.body;
      const categoryId = await this._service.create(categoryCreate);
      res
        .status(201)
        .json(
          new SuccessResponse(
            categoryId,
            "Category created successfully"
          ).toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const categoryUpdate = req.body;
      const categoryId = await this._service.update(id, categoryUpdate);
      res
        .status(200)
        .json(
          new SuccessResponse(
            categoryId,
            "Category updated successfully"
          ).toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const deletedId = await this._service.delete(id);
      res
        .status(200)
        .json(
          new SuccessResponse(
            deletedId,
            "Category deleted successfully"
          ).toDTO()
        );
    } catch (err) {
      if (!(err instanceof ErrorResponse)) return;
      next(err);
    }
  };
}
