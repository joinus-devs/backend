import { Router } from "express";
import { UserController } from "../controller";

const userRoutes = (controller: UserController) => {
  const router = Router();

  router.route("/").get(controller.getUsers);

  return router;
};

export default userRoutes;
