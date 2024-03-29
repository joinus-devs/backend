import {
  CheckEmailParams,
  SigninParams,
  SigninSocialParams,
  SignupParams,
  SignupSocialParams,
} from "../models";
import { CoreSchema } from "./common";

export const signupParamsDoc: CoreSchema<SignupParams> = {
  password: { type: "string", example: "1234" },
  name: { type: "string", example: "John Doe" },
  profile: {
    type: "string",
    example: "https://kr.object.ncloudstorage.com/joinus/image/profile.png",
  },
  sex: { type: "boolean", example: true },
  birth: { type: "string", example: "1999-01-01" },
  phone: { type: "string", example: "01012341234" },
  email: { type: "string", example: "john@gmail.com" },
};

export const signinParmasDoc: CoreSchema<SigninParams> = {
  email: { type: "string", example: "john@gmail.com" },
  password: { type: "string", example: "joinus" },
};

export const signupSocialParamsDoc: CoreSchema<SignupSocialParams> = {
  social_id: { type: "string", example: "1234" },
  type: { type: "string", example: "google" },
  name: { type: "string", example: "John Doe" },
  profile: {
    type: "string",
    example: "https://kr.object.ncloudstorage.com/joinus/image/profile.png",
  },
  sex: { type: "boolean", example: true },
  birth: { type: "string", example: "1999-01-01" },
  phone: { type: "string", example: "01012341234" },
  email: { type: "string", example: "john@gmail.com" },
};

export const signinSocialParamsDoc: CoreSchema<SigninSocialParams> = {
  social_id: { type: "string", example: "1234" },
  type: { type: "string", example: "google" },
};

export const singinResponseDoc = {
  token: { type: "string", example: "token" },
};

export const checkEmailParamsDoc: CoreSchema<CheckEmailParams> = {
  email: { type: "string", example: "john@gmail.com" },
};
