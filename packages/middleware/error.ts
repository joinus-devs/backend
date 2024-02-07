import { ErrorMiddelWare } from "../types";

const errorHandler: ErrorMiddelWare = (err, req, res, next) => {
  console.log(err);
  res.status(err.status).json(err.toDTO());
  next();
};

export default errorHandler;
