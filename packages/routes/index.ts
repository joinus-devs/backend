import { Router } from "express";
import AppManager from "../app";
import userRoutes from "./user";

const initRoutes = (appManager: AppManager) => {
  const router = Router();

  router.use("/users", userRoutes(appManager.appController.userController));

  return router;
};

export default initRoutes;
