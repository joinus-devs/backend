import { cloneDeep } from "lodash";
import {
  CommentCreate,
  CommentDto,
  CommentScheme,
  CommentUpdate,
} from "../models";
import { CoreSchema, makeScheme } from "./common";
import { userDtoDoc } from "./user";

const commentBase: CoreSchema<Omit<CommentScheme, "user_id" | "feed_id">> = {
  title: { type: "string", example: "title" },
  content: { type: "string", example: "content" },
};

export const commentDoc: CoreSchema<CommentScheme> = {
  ...cloneDeep(commentBase),
  user_id: { type: "number", example: 1 },
  feed_id: { type: "number", example: 1 },
};

export const commentDtoDoc: CoreSchema<CommentDto> = {
  ...cloneDeep(commentDoc),
  user: { properties: makeScheme(userDtoDoc) },
};

export const commentCreateDoc: CoreSchema<CommentCreate> =
  cloneDeep(commentBase);

export const commentUpdateDoc: CoreSchema<CommentUpdate> =
  cloneDeep(commentBase);
