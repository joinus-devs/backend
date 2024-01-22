import { Router } from "express";
import { AppProvider } from "../modules";
import clubRoutes from "./club";
import userRoutes from "./user";

const initRoutes = (appManager: AppProvider) => {
  const router = Router();

  router.use("/users", userRoutes(appManager.appController.userController));
  router.use("/clubs", clubRoutes(appManager.appController.clubController));

  return router;
};

export default initRoutes;
