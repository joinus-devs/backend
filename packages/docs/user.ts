import { cloneDeep } from "lodash";
import { UserDto, UserInClubDto, UserScheme, UserUpdate } from "../models";
import { CoreSchema } from "./common";

const userBase: CoreSchema<UserDto> = {
  social_id: { type: "string", example: "1234" },
  name: { type: "string", example: "John Doe" },
  sex: { type: "boolean", example: true },
  phone: { type: "string", example: "01012341234" },
  email: { type: "string", example: "john@gmail.com" },
};

export const userDoc: CoreSchema<UserScheme> = {
  ...cloneDeep(userBase),
  password: { type: "string", example: "1234" },
};

export const userDtoDoc: CoreSchema<UserDto> = cloneDeep(userBase);

export const userInClubDtoDoc: CoreSchema<UserInClubDto> = {
  ...cloneDeep(userBase),
  role: { type: "string", example: "admin" },
  exp: { type: "number", example: 1000 },
};

export const userUpdateDoc: CoreSchema<UserUpdate> = cloneDeep(userDoc);
