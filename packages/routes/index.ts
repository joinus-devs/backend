import { Router } from "express";
import { AppProvider } from "../modules";
import authRoutes from "./auth";
import clubRoutes from "./club";
import commentRoutes from "./comment";
import feedRoutes from "./feed";
import userRoutes from "./user";

const initRoutes = (appManager: AppProvider) => {
  const router = Router();

  router.use("/auth", authRoutes(appManager.appController.authController));
  router.use("/users", userRoutes(appManager.appController.userController));
  router.use(
    "/clubs",
    clubRoutes(
      appManager.appController.clubController,
      appManager.appController.userController,
      appManager.appController.feedController
    )
  );
  router.use(
    "/feeds",
    feedRoutes(
      appManager.appController.feedController,
      appManager.appController.commentController
    )
  );
  router.use(
    "/comments",
    commentRoutes(appManager.appController.commentController)
  );

  return router;
};

export default initRoutes;
