import { Router } from "express";
import { AppProvider } from "../modules";
import authRoutes from "./auth";
import clubRoutes from "./club";
import userRoutes from "./user";

const initRoutes = (appManager: AppProvider) => {
  const router = Router();

  router.use("/auth", authRoutes(appManager.appController.authController));
  router.use("/users", userRoutes(appManager.appController.userController));
  router.use("/clubs", clubRoutes(appManager.appController.clubController));

  return router;
};

export default initRoutes;
