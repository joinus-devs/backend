import { Router } from "express";
import multer from "multer";
import { IStorageController } from "../controller/storage";
import Docs from "../docs";

const storageRoutes = (controller: IStorageController) => {
  const router = Router();

  router.route("/:category").post(multer().single("image"), controller.upload);

  return router;
};

export default storageRoutes;

const swagger = Docs.getInstance();
swagger.add({
  "/storage/{category}": {
    post: {
      tags: ["Storage"],
      summary: "파일 업로드",
      description: "파일을 업로드합니다.",
      parameters: [
        {
          in: "path",
          name: "category",
          required: true,
          schema: {
            type: "string",
            enum: ["image"],
          },
        },
        {
          in: "formData",
          name: "image",
          required: true,
          schema: {
            type: "file",
          },
        },
      ],
      responses: {
        201: { $ref: "#/components/responses/stringResponse" },
        400: { $ref: "#/components/responses/errorResponse" },
        500: { $ref: "#/components/responses/errorResponse" },
      },
    },
  },
});
