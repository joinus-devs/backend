import jwt from "jsonwebtoken";
import Errors from "../constants/errors";
import { MiddelWare } from "../types";

const whiteList = [
  "/auth/signin",
  "/auth/signup",
  "/auth/signin/social",
  "/auth/signup/social",
];

const authenticator: MiddelWare = (req, res, next) => {
  if (req.originalUrl.includes("docs")) return next();
  if (whiteList.includes(req.originalUrl)) return next();

  const key = process.env.JWT_SECRET!;
  try {
    (req as any).decoded = jwt.verify(req.headers.authorization!, key);
    return next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(Errors.InvalidToken);
    }
    if (err instanceof jwt.TokenExpiredError) {
      next(Errors.TokenExpired);
    }
    next(Errors.InternalServerError);
  }
};

export default authenticator;
