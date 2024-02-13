import { Router } from "express";
import { IUserController } from "../controller";
import Docs from "../docs";
import { IClubController } from "./../controller/club";

const userRoutes = (
  userController: IUserController,
  clubController: IClubController
) => {
  const router = Router();

  router.route("/").get(userController.findAll);
  router
    .route("/:id")
    .get(userController.find)
    .put(userController.update)
    .delete(userController.delete);
  router.route("/:id/clubs").get(clubController.findAllByUser);

  return router;
};

export default userRoutes;

const swagger = Docs.getInstance();
swagger.add({
  "/users": {
    get: {
      summary: "Get all users",
      tags: ["Users"],
      parameters: [
        { $ref: "#/components/parameters/cursorParam" },
        { $ref: "#/components/parameters/limitParam" },
      ],
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
  "/users/{id}/clubs": {
    get: {
      summary: "Get all clubs of a user",
      tags: ["Users"],
      responses: {
        200: { $ref: "#/components/responses/clubsWithUserInfoResponse" },
      },
    },
  },
});
