import { Request } from "express";
import { ErrorMiddelWare, ErrorResponse } from "../types";

const errorLog = (req: Request, message: string) => {
  console.log(
    "Method:",
    req.method,
    "URL:",
    req.originalUrl,
    "Error:",
    message
  );
};

const errorHandler: ErrorMiddelWare = (err, req, res, next) => {
  if (!(err instanceof ErrorResponse)) {
    const unknownErr = new ErrorResponse(
      500,
      50000,
      `알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요. ${err.message}`
    );
    errorLog(req, unknownErr.message);
    res.status(unknownErr.status).json(unknownErr.toDTO());
  } else {
    errorLog(req, err.message);
    res.status(err.status).json(err.toDTO());
  }
};

export default errorHandler;
