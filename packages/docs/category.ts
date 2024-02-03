import { cloneDeep } from "lodash";
import {
  CategoryCreate,
  CategoryDto,
  CategoryScheme,
  CategoryUpdate,
} from "../models";
import { CoreSchema } from "./common";

const categoryBase: CoreSchema<CategoryDto> = {
  name: { type: "string", example: "name" },
};

export const categoryDoc: CoreSchema<CategoryScheme> = cloneDeep(categoryBase);

export const categoryDtoDoc: CoreSchema<CategoryDto> = cloneDeep(categoryBase);

export const categoryCreateDoc: CoreSchema<CategoryCreate> =
  cloneDeep(categoryBase);

export const categoryUpdateDoc: CoreSchema<CategoryUpdate> =
  cloneDeep(categoryBase);
