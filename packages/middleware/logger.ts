import { MiddelWare } from "../types";

const logger: MiddelWare = (req, res, next) => {
  console.log("Request URL:", req.method, req.originalUrl);
  next();
};

export default logger;
