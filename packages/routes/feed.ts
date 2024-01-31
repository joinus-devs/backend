import { Router } from "express";
import { ICommentController, IFeedController } from "../controller";
import Swagger from "../docs";

const feedRoutes = (
  feedController: IFeedController,
  commentController: ICommentController
) => {
  const router = Router();

  router.route("/").get(feedController.findAll);
  router
    .route("/:id")
    .get(feedController.find)
    .put(feedController.update)
    .delete(feedController.delete);
  router
    .route("/:id/comments")
    .get(commentController.findAllByFeed)
    .post(commentController.create);

  return router;
};

export default feedRoutes;

const swagger = Swagger.getInstance();
swagger.add({
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
  "/feeds/{id}/comments": {
    get: {
      summary: "Get all comments of a feed",
      tags: ["Feeds"],
      responses: { 200: { $ref: "#/components/responses/commentsResponse" } },
    },
    post: {
      summary: "Create a comment",
      tags: ["Feeds"],
      parameters: [{ $ref: "#/components/parameters/commentCreate" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
});