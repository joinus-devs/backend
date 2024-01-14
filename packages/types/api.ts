import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../models/response";

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
