import { SigninParams, UserCreate } from "../models";
import { CoreSchema } from "./common";

export const signupParamsDoc: CoreSchema<UserCreate> = {
  password: { type: "string", example: "1234" },
  social_id: { type: "string", example: "1234" },
  name: { type: "string", example: "John Doe" },
  sex: { type: "boolean", example: true },
  phone: { type: "string", example: "01012341234" },
  email: { type: "string", example: "john@gmail.com" },
};

export const signinParmasDoc: CoreSchema<SigninParams> = {
  email: { type: "string", example: "john@gmail.com" },
  password: { type: "string", example: "joinus" },
};

export const singinResponseDoc = {
  token: { type: "string", example: "token" },
};
