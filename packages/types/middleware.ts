import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "./response";

export type MiddelWare = (
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => void;

export type ErrorMiddelWare = (
  err: ErrorResponse,
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => void;
