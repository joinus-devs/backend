import { cloneDeep } from "lodash";
import { ClubCreate, ClubDto, ClubScheme, ClubUpdate } from "../models";
import { CoreSchema } from "./common";

const clubBase: CoreSchema<ClubDto> = {
  name: { type: "string", example: "name" },
  description: { type: "string", example: "description" },
  capacity: { type: "number", example: 1 },
  sex: { type: "boolean", example: true },
  minimum_age: { type: "number", example: 1 },
  maximum_age: { type: "number", example: 1 },
  categories: { type: "array", items: { type: "number", example: 1 } },
};

export const clubDoc: CoreSchema<ClubScheme> = cloneDeep(clubBase);

export const clubDtoDoc: CoreSchema<ClubDto> = cloneDeep(clubBase);

export const clubCreateDoc: CoreSchema<ClubCreate> = cloneDeep(clubBase);

export const clubUpdateDoc: CoreSchema<ClubUpdate> = cloneDeep(clubBase);
