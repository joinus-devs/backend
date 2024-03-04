import { IdEntity } from "./common";
import { UserScheme } from "./user";

export interface SigninParams {
  email: string;
  password: string;
}

export interface SigninSocialParams {
  social_id: string;
  type: "google" | "kakao" | "naver";
}

export type SignupParams = Omit<
  UserScheme,
  keyof IdEntity | "social_id" | "type"
>;

export type SignupSocialParams = Omit<UserScheme, keyof IdEntity | "password">;

export type CheckEmailParams = Pick<UserScheme, "email">;
