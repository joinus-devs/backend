import { validationResult } from "express-validator";
import { ErrorResponse, MiddelWare } from "../types";

const validator: MiddelWare = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json(
      new ErrorResponse(400, 40000, "Bad Request", {
        errors: errors.array(),
      }).toDTO()
    );
  }

  next();
};

export default validator;
