import { Router } from "express";
import { body } from "express-validator";
import { IAuthController } from "../controller";
import Docs from "../docs";
import { validator } from "../middleware";

const authRoutes = (controller: IAuthController) => {
  const router = Router();

  router.route("/me").get(controller.me);
  router
    .route("/signin")
    .post(
      body("email").isEmail(),
      body("password").isString().isLength({ min: 8 }),
      validator,
      controller.signin
    );
  router
    .route("/signin/social")
    .post(
      body("social_id").isString(),
      body("type").isString(),
      validator,
      controller.signinSocial
    );
  router
    .route("/signup")
    .post(
      body("password").isString().isLength({ min: 8 }),
      body("name").isString(),
      body("sex").isBoolean(),
      body("birth").isString(),
      body("phone").isString(),
      body("email").isEmail(),
      validator,
      controller.signup
    );
  router
    .route("/signup/social")
    .post(
      body("social_id").isString(),
      body("type").isString(),
      body("name").isString(),
      body("sex").isBoolean(),
      body("birth").isString(),
      body("phone").isString(),
      body("email").isEmail(),
      validator,
      controller.signupSocial
    );
  router
    .route("/check-email")
    .post(body("email").isEmail(), validator, controller.checkEmail);

  return router;
};

export default authRoutes;

const swagger = Docs.getInstance();
swagger.add({
  "/auth/me": {
    get: {
      summary: "Get current user",
      tags: ["Auth"],
      responses: { 200: { $ref: "#/components/responses/userResponse" } },
    },
  },
  "/auth/signin": {
    post: {
      summary: "Sign in",
      tags: ["Auth"],
      parameters: [{ $ref: "#/components/parameters/signinParams" }],
      responses: { 200: { $ref: "#/components/responses/signinResponse" } },
    },
  },
  "/auth/signup": {
    post: {
      summary: "Sign up",
      tags: ["Auth"],
      parameters: [{ $ref: "#/components/parameters/signupParams" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
  "/auth/signin/social": {
    post: {
      summary: "Sign in with social",
      tags: ["Auth"],
      parameters: [{ $ref: "#/components/parameters/signinSocialParams" }],
      responses: { 200: { $ref: "#/components/responses/signinResponse" } },
    },
  },
  "/auth/signup/social": {
    post: {
      summary: "Sign up with social",
      tags: ["Auth"],
      parameters: [{ $ref: "#/components/parameters/signupSocialParams" }],
      responses: { 200: { $ref: "#/components/responses/numberResponse" } },
    },
  },
  "/auth/check-email": {
    post: {
      summary: "Check email",
      tags: ["Auth"],
      parameters: [{ $ref: "#/components/parameters/checkEmailParams" }],
      responses: { 200: { $ref: "#/components/responses/booleanResponse" } },
    },
  },
});
