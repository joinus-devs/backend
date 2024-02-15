import { Router } from "express";
import { AppProvider } from "../modules";
import authRoutes from "./auth";
import categoryRoutes from "./category";
import clubRoutes from "./club";
import commentRoutes from "./comment";
import feedRoutes from "./feed";
import storageRoutes from "./storage";
import userRoutes from "./user";

const initRoutes = (appManager: AppProvider) => {
  const router = Router();

  router.use(
    "/storage",
    storageRoutes(appManager.appController.storageController)
  );
  router.use("/auth", authRoutes(appManager.appController.authController));
  router.use(
    "/users",
    userRoutes(
      appManager.appController.userController,
      appManager.appController.clubController
    )
  );
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
  router.use(
    "/categories",
    categoryRoutes(
      appManager.appController.categoryController,
      appManager.appController.clubController
    )
  );

  return router;
};

export default initRoutes;
