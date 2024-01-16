import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "./response";

export type MiddelWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type ErrorMiddelWare = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
