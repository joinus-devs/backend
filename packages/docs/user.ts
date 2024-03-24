import { cloneDeep } from "lodash";
import { UserDto, UserInClubDto, UserScheme, UserUpdate } from "../models";
import { CoreSchema } from "./common";

const userBase: CoreSchema<Omit<UserUpdate, "password">> = {
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

export const userDtoDoc: CoreSchema<UserDto> = {
  social_id: { type: "string", example: "1234" },
  type: { type: "string", example: "google" },
  ...cloneDeep(userBase),
};

export const userDoc: CoreSchema<UserScheme> = {
  ...cloneDeep(userDtoDoc),
  password: { type: "string", example: "1234" },
};

export const userInClubDtoDoc: CoreSchema<UserInClubDto> = {
  ...cloneDeep(userDtoDoc),
  role: { type: "string", example: "admin" },
  exp: { type: "number", example: 1000 },
};

export const userUpdateDoc: CoreSchema<UserUpdate> = {
  ...cloneDeep(userDoc),
  password: { type: "string", example: "1234" },
};
