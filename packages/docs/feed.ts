import { cloneDeep } from "lodash";
import { FeedCreate, FeedDto, FeedScheme, FeedUpdate } from "../models";
import { CoreSchema, makeScheme } from "./common";
import { userDtoDoc } from "./user";

const feedBase: CoreSchema<Omit<FeedScheme, "user_id" | "club_id">> = {
  title: { type: "string", example: "title" },
  content: { type: "string", example: "content" },
};

export const feedDoc: CoreSchema<FeedScheme> = {
  ...cloneDeep(feedBase),
  user_id: { type: "number", example: 1 },
  club_id: { type: "number", example: 1 },
};

export const feedDtoDoc: CoreSchema<FeedDto> = {
  ...cloneDeep(feedDoc),
  user: { properties: makeScheme(userDtoDoc) },
};

export const feedCreateDoc: CoreSchema<FeedCreate> = cloneDeep(feedBase);

export const feedUpdateDoc: CoreSchema<FeedUpdate> = cloneDeep(feedBase);
