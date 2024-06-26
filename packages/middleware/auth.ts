import jwt from "jsonwebtoken";
import { match } from "path-to-regexp";
import Errors from "../constants/errors";
import { MiddelWare } from "../types";

const whiteList = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/signin/social",
  "/auth/signup/social",
  "/auth/check-email",
  "/clubs/:id?",
  "/feeds/:id?",
  "/users/:id?",
  "/chats",
];

const authenticator: MiddelWare = (req, res, next) => {
  if (req.originalUrl.includes("docs")) return next();

  const key = process.env.JWT_SECRET!;
  try {
    (req as any).decoded = jwt.verify(req.headers.authorization!, key);
    return next();
  } catch (err) {
    if (match(whiteList)(req.originalUrl)) return next();
    if (err instanceof jwt.JsonWebTokenError) {
      next(Errors.InvalidToken.clone());
    } else if (err instanceof jwt.TokenExpiredError) {
      next(Errors.TokenExpired.clone());
    } else {
      next(Errors.InternalServerError.clone());
    }
  }
};

export default authenticator;
