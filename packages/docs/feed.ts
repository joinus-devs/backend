import { cloneDeep } from "lodash";
import {
  FeedCreate,
  FeedDto,
  FeedScheme,
  FeedUpdate,
  FeedWithClubDto,
} from "../models";
import { clubDtoDoc } from "./club";
import { CoreSchema, makeScheme } from "./common";
import { userDtoDoc } from "./user";

const feedBase: CoreSchema<Omit<FeedScheme, "user_id" | "club_id">> = {
  title: { type: "string", example: "title" },
  content: { type: "string", example: "content" },
  is_private: { type: "boolean", example: true },
  comment_count: { type: "number", example: 1 },
};

export const feedDoc: CoreSchema<FeedScheme> = {
  ...cloneDeep(feedBase),
  user_id: { type: "number", example: 1 },
  club_id: { type: "number", example: 1 },
};

export const feedDtoDoc: CoreSchema<FeedDto> = {
  ...cloneDeep(feedDoc),
  user: makeScheme(userDtoDoc),
};

export const feedWithClubDtoDoc: CoreSchema<FeedWithClubDto> = {
  ...cloneDeep(feedDtoDoc),
  club: makeScheme(clubDtoDoc),
};

export const feedCreateDoc: CoreSchema<FeedCreate> = cloneDeep(feedBase);

export const feedUpdateDoc: CoreSchema<FeedUpdate> = cloneDeep(feedBase);
