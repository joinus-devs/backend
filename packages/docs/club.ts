import { cloneDeep } from "lodash";

const clubBase = {
  name: { type: "string", example: "name" },
  description: { type: "string", example: "description" },
  capacity: { type: "number", example: 1 },
  sex: { type: "boolean", example: true },
  minimum_age: { type: "number", example: 1 },
  maximum_age: { type: "number", example: 1 },
  categories: { type: "array", items: { type: "number", example: 1 } },
};

export const clubDoc = cloneDeep(clubBase);

export const clubDtoDoc: any = cloneDeep(clubBase);

export const clubCreateDoc = cloneDeep(clubBase);

export const clubUpdateDoc = cloneDeep(clubBase);
