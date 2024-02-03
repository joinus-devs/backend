import { Router } from "express";
import { ICommentController } from "../controller";
import Docs from "../docs";

const commentRoutes = (controller: ICommentController) => {
  const router = Router();

  router.route("/").get(controller.findAll);
  router
    .route("/:id")
    .get(controller.find)
    .put(controller.update)
    .delete(controller.delete);

  return router;
};

export default commentRoutes;

const swagger = Docs.getInstance();
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
});
