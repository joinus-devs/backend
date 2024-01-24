import { Router } from "express";
import { body } from "express-validator";
import { IAuthController } from "../controller";
import Swagger from "../docs";

const authRoutes = (controller: IAuthController) => {
  const router = Router();

  router.route("/me").get(controller.me);
  router
    .route("/signin")
    .post(
      body("email").isEmail(),
      body("password").isString(),
      controller.signin
    );
  router
    .route("/signup")
    .post(
      body("password").isString(),
      body("social_id").isString(),
      body("name").isString(),
      body("sex").isBoolean(),
      body("phone").isString(),
      body("email").isEmail(),
      controller.signup
    );

  return router;
};

export default authRoutes;

const swagger = Swagger.getInstance();
swagger.add({
  "/me": {
    get: {
      summary: "Get current user",
      tags: ["Auth"],
      responses: { 200: { $ref: "#/components/responses/userResponse" } },
    },
  },
  "/signin": {
    post: {
      summary: "Sign in",
      tags: ["Auth"],
      parameters: [{ $ref: "#/components/parameters/signinParams" }],
      responses: { 200: { $ref: "#/components/responses/signinResponse" } },
    },
  },
  "/signup": {
    post: {
      summary: "Sign up",
      tags: ["Auth"],
      parameters: [{ $ref: "#/components/parameters/signupParams" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
});
