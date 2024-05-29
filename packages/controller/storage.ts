import { NextFunction, Request, RequestHandler, Response } from "express";
import Errors from "../constants/errors";
import { ContentCategory, IStorageService } from "../services/storage";
import { Nullable, SuccessResponse } from "../types";

const parseCategory = (category: string): ContentCategory => {
  switch (category) {
    case "image":
      return "image";
    default:
      throw new Error("Invalid category");
  }
};

export interface IStorageController {
  upload: RequestHandler<{ category: string }>;
}

export class StorageController implements IStorageController {
  private static _instance: Nullable<StorageController> = null;
  private _service: IStorageService;

  private constructor(service: IStorageService) {
    this._service = service;
  }

  static getInstance(service: IStorageService) {
    if (!this._instance) {
      this._instance = new StorageController(service);
    }

    return this._instance;
  }

  upload = async (
    req: Request<{ category: string }>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.file) {
      return next(Errors.FileNotExists);
    }
    let category: ContentCategory;
    try {
      category = parseCategory(req.params.category);
    } catch (error) {
      return next(Errors.InvalidCategory);
    }
    try {
      const path = await this._service.upload(category, req.file.buffer);
      res
        .status(201)
        .json(new SuccessResponse(path, "파일 업로드에 성공했습니다.").toDTO());
    } catch (error) {
      next(error);
    }
  };
}
