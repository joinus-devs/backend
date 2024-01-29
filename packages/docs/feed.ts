import { cloneDeep } from "lodash";
import { clubDtoDoc } from "./club";
import { userDtoDoc } from "./user";

const feedBase = {
  title: { type: "string", example: "title" },
  content: { type: "string", example: "content" },
};

export const feedDoc = {
  ...cloneDeep(feedBase),
  user_id: { type: "number", example: 1 },
  club_id: { type: "number", example: 1 },
  user: { properties: cloneDeep(userDtoDoc) },
  club: { properties: cloneDeep(clubDtoDoc) },
};

export const feedDtoDoc = cloneDeep(feedBase);

export const feedCreateDoc = cloneDeep(feedBase);

export const feedUpdateDoc = cloneDeep(feedBase);
