import { Router } from "express";
import { IClubController } from "../controller/club";
import Swagger from "../docs";

const clubRoutes = (controller: IClubController) => {
  const router = Router();

  router.route("/").get(controller.findAll).post(controller.create);
  router
    .route("/:id")
    .get(controller.find)
    .put(controller.update)
    .delete(controller.delete);

  return router;
};

export default clubRoutes;

const swagger = Swagger.getInstance();
swagger.add({
  "/users/": {
    get: {
      summary: "Get all users",
      tags: ["User"],
      responses: { 200: { $ref: "#/components/responses/UsersResponse" } },
    },
    post: {
      summary: "Create a user",
      tags: ["User"],
      parameters: [{ $ref: "#/components/parameters/UserCreate" }],
      responses: { 200: { $ref: "#/components/responses/NumberResponse" } },
    },
  },
  "/users/{id}": {
    get: {
      summary: "Get a user",
      tags: ["User"],
      responses: { 200: { $ref: "#/components/responses/UserResponse" } },
    },
    put: {
      summary: "Update a user",
      tags: ["User"],
      parameters: [{ $ref: "#/components/parameters/UserUpdate" }],
      responses: { 200: { $ref: "#/components/responses/NumberResponse" } },
    },
    delete: {
      summary: "Delete a user",
      tags: ["User"],
      responses: { 200: { $ref: "#/components/responses/NumberResponse" } },
    },
  },
});
