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
      tags: ["Clubs"],
      responses: { 200: { $ref: "#/components/responses/clubsResponse" } },
    },
    post: {
      summary: "Create a club",
      tags: ["Clubs"],
      parameters: [{ $ref: "#/components/parameters/clubCreate" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
  "/clubs/{id}": {
    get: {
      summary: "Get a club",
      tags: ["Clubs"],
      responses: { 200: { $ref: "#/components/responses/clubResponse" } },
    },
    put: {
      summary: "Update a club",
      tags: ["Clubs"],
      parameters: [{ $ref: "#/components/parameters/clubUpdate" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
    delete: {
      summary: "Delete a club",
      tags: ["Clubs"],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
});
