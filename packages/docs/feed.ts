import { cloneDeep } from "lodash";
import { FeedCreate, FeedDto, FeedScheme, FeedUpdate } from "../models";
import { CoreSchema } from "./common";
import { userDtoDoc } from "./user";

const feedBase: CoreSchema<FeedDto> = {
  user_id: { type: "number", example: 1 },
  club_id: { type: "number", example: 1 },
  title: { type: "string", example: "title" },
  content: { type: "string", example: "content" },
  user: userDtoDoc,
};

export const feedDoc: CoreSchema<FeedScheme> = cloneDeep(feedBase);

export const feedDtoDoc: CoreSchema<FeedDto> = cloneDeep(feedBase);

export const feedCreateDoc: CoreSchema<FeedCreate> = cloneDeep(feedBase);

export const feedUpdateDoc: CoreSchema<FeedUpdate> = cloneDeep(feedBase);
