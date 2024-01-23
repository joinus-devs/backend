import jwt from "jsonwebtoken";
import { ErrorResponse, MiddelWare } from "../types";

const whiteList = ["/auth/signin", "/auth/signup"];

const authenticator: MiddelWare = (req, res, next) => {
  if (req.originalUrl.includes("docs")) return next();
  if (whiteList.includes(req.originalUrl)) return next();

  const key = process.env.JWT_SECRET!;
  try {
    (req as any).decoded = jwt.verify(req.headers.authorization!, key);
    return next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new ErrorResponse(401, "Invalid Token"));
    }
    if (err instanceof jwt.TokenExpiredError) {
      next(new ErrorResponse(419, "Token Expired"));
    }
    next(new ErrorResponse(500, "Internal Server Error"));
  }
};

export default authenticator;
