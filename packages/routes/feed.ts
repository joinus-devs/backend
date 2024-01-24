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
      tags: ["Feeds"],
      responses: { 200: { $ref: "#/components/responses/feedsResponse" } },
    },
    post: {
      summary: "Create a feed",
      tags: ["Feeds"],
      parameters: [{ $ref: "#/components/parameters/feedCreate" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
  "/feeds": {
    get: {
      summary: "Get all feed",
      tags: ["Feeds"],
      responses: { 200: { $ref: "#/components/responses/feedsResponse" } },
    },
  },
  "/feeds/{id}": {
    get: {
      summary: "Get a feed",
      tags: ["Feeds"],
      responses: { 200: { $ref: "#/components/responses/feedResponse" } },
    },
    put: {
      summary: "Update a feed",
      tags: ["Feeds"],
      parameters: [{ $ref: "#/components/parameters/feedUpdate" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
    delete: {
      summary: "Delete a feed",
      tags: ["Feeds"],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
});
