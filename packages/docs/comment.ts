import { cloneDeep } from "lodash";
import {
  CommentCreate,
  CommentDto,
  CommentScheme,
  CommentUpdate,
} from "../models";
import { CoreSchema } from "./common";
import { userDtoDoc } from "./user";

const commentBase: CoreSchema<CommentDto> = {
  user_id: { type: "number", example: 1 },
  feed_id: { type: "number", example: 1 },
  title: { type: "string", example: "title" },
  content: { type: "string", example: "content" },
  user: userDtoDoc,
};

export const commentDoc: CoreSchema<CommentScheme> = cloneDeep(commentBase);

export const commentDtoDoc: CoreSchema<CommentDto> = cloneDeep(commentBase);

export const commentCreateDoc: CoreSchema<CommentCreate> =
  cloneDeep(commentBase);

export const commentUpdateDoc: CoreSchema<CommentUpdate> =
  cloneDeep(commentBase);
