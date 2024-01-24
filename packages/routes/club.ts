import { Router } from "express";
import { IClubController } from "../controller";
import Swagger from "../docs";

const clubRoutes = (controller: IClubController) => {
  const router = Router();

  router.route("/").get(controller.findAll).post(controller.create);
  router
    .route("/:id")
    .get(controller.find)
    .put(controller.update)
    .delete(controller.delete);

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
