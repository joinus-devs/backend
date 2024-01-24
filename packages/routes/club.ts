import { Router } from "express";
import { IClubController, IFeedController } from "../controller";
import Swagger from "../docs";

const clubRoutes = (
  clubController: IClubController,
  feedController: IFeedController
) => {
  const router = Router();

  router.route("/").get(clubController.findAll).post(clubController.create);
  router
    .route("/:id")
    .get(clubController.find)
    .put(clubController.update)
    .delete(clubController.delete);
  router
    .route("/:id/feeds")
    .get(feedController.findAllByClub)
    .post(feedController.create);

  return router;
};

export default clubRoutes;

const swagger = Swagger.getInstance();
swagger.add({
  "/clubs": {
    get: {
      summary: "Get all club",
      tags: ["Club"],
      responses: { 200: { $ref: "#/components/responses/ClubsResponse" } },
    },
    post: {
      summary: "Create a club",
      tags: ["Club"],
      parameters: [{ $ref: "#/components/parameters/ClubCreate" }],
      responses: { 200: { $ref: "#/components/responses/NumberResponse" } },
    },
  },
  "/clubs/{id}": {
    get: {
      summary: "Get a club",
      tags: ["Club"],
      responses: { 200: { $ref: "#/components/responses/ClubResponse" } },
    },
    put: {
      summary: "Update a club",
      tags: ["Club"],
      parameters: [{ $ref: "#/components/parameters/ClubUpdate" }],
      responses: { 200: { $ref: "#/components/responses/NumberResponse" } },
    },
    delete: {
      summary: "Delete a club",
      tags: ["Club"],
      responses: { 200: { $ref: "#/components/responses/NumberResponse" } },
    },
  },
});
