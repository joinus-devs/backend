import { Router } from "express";
import { UserController } from "../controller";

const userRoutes = (controller: UserController) => {
  const router = Router();

  router.route("/").get(controller.findAll).post(controller.create);
  router
    .route("/:id")
    .get(controller.find)
    .put(controller.update)
    .delete(controller.delete);

  return router;
};

export default userRoutes;
