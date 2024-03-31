import { cloneDeep } from "lodash";
import { ClubChatDto, ClubChatScheme } from "../models";
import { clubDtoDoc } from "./club";
import { CoreSchema, makeScheme } from "./common";
import { userDtoDoc } from "./user";

const clubChatBase: CoreSchema<ClubChatScheme> = {
  user_id: { type: "number", example: 1 },
  club_id: { type: "number", example: 1 },
  message: { type: "string", example: "message" },
};

export const clubChatDoc: CoreSchema<ClubChatScheme> = {
  ...cloneDeep(clubChatBase),
};

export const clubChatDtoDoc: CoreSchema<ClubChatDto> = {
  ...cloneDeep(clubChatBase),
  user: makeScheme(userDtoDoc),
  club: makeScheme(clubDtoDoc),
};
