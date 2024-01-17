import { Router } from "express";
import { body } from "express-validator";
import { IUserController } from "../controller";
import Swagger from "../docs";

const userRoutes = (controller: IUserController) => {
  const router = Router();

  router
    .route("/")
    .get(controller.findAll)
    .post(
      body("password").isString(),
      body("social_id").isString(),
      body("name").isString(),
      body("sex").isBoolean(),
      body("phone").isString(),
      body("email").isEmail(),
      controller.create
    );
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
