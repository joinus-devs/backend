import { Router } from "express";
import { IUserController } from "../controller";
import Swagger from "../docs";

const userRoutes = (controller: IUserController) => {
  const router = Router();

  router.route("/").get(controller.findAll);
  router
    .route("/:id")
    .get(controller.find)
    .put(controller.update)
    .delete(controller.delete);

  return router;
};

export default userRoutes;

const swagger = Swagger.getInstance();
swagger.add({
  "/users": {
    get: {
      summary: "Get all users",
      tags: ["Users"],
      responses: { 200: { $ref: "#/components/responses/usersResponse" } },
    },
  },
  "/users/{id}": {
    get: {
      summary: "Get a user",
      tags: ["Users"],
      responses: { 200: { $ref: "#/components/responses/userResponse" } },
    },
    put: {
      summary: "Update a user",
      tags: ["Users"],
      parameters: [{ $ref: "#/components/parameters/userUpdate" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
    delete: {
      summary: "Delete a user",
      tags: ["Users"],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
});
