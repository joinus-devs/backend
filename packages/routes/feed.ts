import { Router } from "express";
import { IFeedController } from "../controller";
import Swagger from "../docs";

const feedRoutes = (controller: IFeedController) => {
  const router = Router();

  router.route("/").get(controller.findAll);
  router
    .route("/:id")
    .get(controller.find)
    .put(controller.update)
    .delete(controller.delete);

  return router;
};

export default feedRoutes;

const swagger = Swagger.getInstance();
swagger.add({
  "/clubs/{id}/feeds": {
    get: {
      summary: "Get all feed of a club",
      tags: ["Feed"],
      responses: { 200: { $ref: "#/components/responses/ClubsResponse" } },
    },
    post: {
      summary: "Create a feed",
      tags: ["Feed"],
      parameters: [{ $ref: "#/components/parameters/ClubCreate" }],
      responses: { 200: { $ref: "#/components/responses/NumberResponse" } },
    },
  },
  "/feeds": {
    get: {
      summary: "Get all feed",
      tags: ["Feed"],
      responses: { 200: { $ref: "#/components/responses/ClubsResponse" } },
    },
  },
  "/feeds/{id}": {
    get: {
      summary: "Get a feed",
      tags: ["Feed"],
      responses: { 200: { $ref: "#/components/responses/ClubResponse" } },
    },
    put: {
      summary: "Update a feed",
      tags: ["Feed"],
      parameters: [{ $ref: "#/components/parameters/ClubUpdate" }],
      responses: { 200: { $ref: "#/components/responses/NumberResponse" } },
    },
    delete: {
      summary: "Delete a feed",
      tags: ["Feed"],
      responses: { 200: { $ref: "#/components/responses/NumberResponse" } },
    },
  },
});
