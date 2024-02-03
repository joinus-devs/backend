import { validationResult } from "express-validator";
import { ErrorMiddelWare, ErrorResponse } from "../types";

const errorHandler: ErrorMiddelWare = (err, req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json(
      new ErrorResponse(400, 40000, "Bad Request", {
        errors: errors.array(),
      }).toDTO()
    );
  }

  console.log(err);
  res.status(err.status).json(err.toDTO());
};

export default errorHandler;
