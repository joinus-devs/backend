import { Router } from "express";
import { ICommentController } from "../controller";
import Docs from "../docs";

const commentRoutes = (controller: ICommentController) => {
  const router = Router();

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
  "/comments/{id}": {
    get: {
      summary: "Get a comment",
      tags: ["Comments"],
      responses: { 200: { $ref: "#/components/responses/commentResponse" } },
    },
    put: {
      summary: "Update a comment",
      tags: ["Comments"],
      parameters: [{ $ref: "#/components/parameters/commentUpdate" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
    delete: {
      summary: "Delete a comment",
      tags: ["Comments"],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
});
