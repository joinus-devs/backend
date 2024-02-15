import { NextFunction, Request, Response } from "express";

export type MiddelWare = (
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => void;

export type ErrorMiddelWare = (
  err: Error,
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => void;
