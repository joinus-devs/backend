import { Router } from "express";
import { IClubController } from "../controller";
import { ICategoryController } from "../controller/category";
import Swagger from "../docs";

const categoryRoutes = (
  categoryController: ICategoryController,
  clubController: IClubController
) => {
  const router = Router();

  router.route("/").get(categoryController.findAll);
  router
    .route("/:id")
    .get(categoryController.find)
    .put(categoryController.update)
    .delete(categoryController.delete);
  router.route("/:id/clubs").get(clubController.findAllByCategory);

  return router;
};

export default categoryRoutes;

const swagger = Swagger.getInstance();
swagger.add({
  "/categories": {
    get: {
      summary: "Get all category",
      tags: ["Categories"],
      responses: { 200: { $ref: "#/components/responses/categoriesResponse" } },
    },
    post: {
      summary: "Create a category",
      tags: ["Categories"],
      parameters: [{ $ref: "#/components/parameters/categoryCreate" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
  "/categories/{id}": {
    get: {
      summary: "Get a category",
      tags: ["Categories"],
      responses: { 200: { $ref: "#/components/responses/categoryResponse" } },
    },
    put: {
      summary: "Update a category",
      tags: ["Categories"],
      parameters: [{ $ref: "#/components/parameters/categoryUpdate" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
    delete: {
      summary: "Delete a category",
      tags: ["Categories"],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
  "/categories/{id}/clubs": {
    get: {
      summary: "Get all club of a category",
      tags: ["Categories"],
      responses: { 200: { $ref: "#/components/responses/clubsResponse" } },
    },
  },
});
