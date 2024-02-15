import { cloneDeep } from "lodash";
import { Parameter } from "swagger-jsdoc";
import { UserSetRole } from "../controller";
import {
  ClubCreate,
  ClubDto,
  ClubScheme,
  ClubUpdate,
  ClubWithUserInfoDto,
  Role,
} from "../models";
import { CoreSchema } from "./common";
import { userInClubDtoDoc } from "./user";

const clubBase: CoreSchema<ClubDto> = {
  name: { type: "string", example: "name" },
  description: { type: "string", example: "description" },
  capacity: { type: "number", example: 1 },
  sex: { type: "boolean", example: true },
  minimum_age: { type: "number", example: 1 },
  maximum_age: { type: "number", example: 1 },
  categories: { type: "array", items: { type: "number", example: 1 } },
  images: {
    type: "array",
    items: {
      type: "object",
      properties: {
        url: {
          type: "string",
          example:
            "https://kr.object.ncloudstorage.com/joinus/image/profile.png",
        },
        type: { type: "string", example: "main" },
      },
    },
  },
};

export const clubDoc: CoreSchema<ClubScheme> = cloneDeep(clubBase);

export const clubWithUserInfoDoc: CoreSchema<ClubWithUserInfoDto> = {
  ...cloneDeep(clubBase),
  user: {
    type: "object",
    properties: cloneDeep(userInClubDtoDoc),
  },
};

export const clubDtoDoc: CoreSchema<ClubDto> = cloneDeep(clubBase);

export const clubCreateDoc: CoreSchema<ClubCreate> = cloneDeep(clubBase);

export const clubUpdateDoc: CoreSchema<ClubUpdate> = cloneDeep(clubBase);

export const userSetRoleDoc: CoreSchema<UserSetRole> = {
  role: { type: "string", example: "member" },
};

export const roleQueryParamsDoc: Parameter = {
  in: "query",
  name: "roles",
  required: false,
  schema: {
    type: "array",
    items: {
      type: "string",
      enum: Object.values(Role),
    },
  },
};
