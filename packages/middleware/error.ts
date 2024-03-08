import { ErrorMiddelWare, ErrorResponse } from "../types";

const errorHandler: ErrorMiddelWare = (err, req, res, next) => {
  if (!(err instanceof ErrorResponse)) {
    console.log("Unknown error occurred", err.message);
    const unknownErr = new ErrorResponse(
      500,
      50000,
      `알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요. ${err.message}`
    );
    res.status(unknownErr.status).json(unknownErr.toDTO());
    next();
  } else {
    res.status(err.status).json(err.toDTO());
    next();
  }
};

export default errorHandler;
