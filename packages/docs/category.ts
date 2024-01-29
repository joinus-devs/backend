import { cloneDeep } from "lodash";

const categoryBase = {
  name: { type: "string", example: "name" },
};

export const categoryDoc = cloneDeep(categoryBase);

export const categoryDtoDoc: any = cloneDeep(categoryBase);

export const categoryCreateDoc = cloneDeep(categoryBase);

export const categoryUpdateDoc = cloneDeep(categoryBase);
