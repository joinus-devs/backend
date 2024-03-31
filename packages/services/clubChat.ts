import { DataSource, Repository } from "typeorm";
import Errors from "../constants/errors";
import { ClubChat, ClubChatConverter, ClubChatDto } from "../models";
import { TransactionManager } from "../modules";
import { Nullable } from "../types";
import { CursorDto } from "./../types/response";

export interface IClubChatService {
  findAllByClub(
    club: number,
    cursor?: number,
    limit?: number
  ): Promise<CursorDto<ClubChatDto[]>>;
}

export class ClubChatService implements IClubChatService {
  private static _instance: Nullable<ClubChatService> = null;
  private _transactionManager: TransactionManager;
  private _clubChatRepository: Repository<ClubChat>;

  private constructor(
    dataSource: DataSource,
    transactionManager: TransactionManager
  ) {
    this._transactionManager = transactionManager;
    this._clubChatRepository = dataSource.getRepository(ClubChat);
  }

  static getInstance(
    dataSource: DataSource,
    transactionManager: TransactionManager
  ) {
    if (!this._instance) {
      this._instance = new ClubChatService(dataSource, transactionManager);
    }

    return this._instance;
  }

  findAllByClub = async (clubId: number, cursor?: number, limit = 10) => {
    try {
      const clubChats = await this._clubChatRepository
        .createQueryBuilder("clubChat")
        .leftJoinAndSelect("clubChat.user", "user")
        .where("clubChat.club_id = :clubId", { clubId })
        .andWhere("clubChat.deleted_at IS NULL")
        .andWhere(cursor ? "clubChat.id < :cursor" : "1=1", { cursor })
        .orderBy("clubChat.id", "DESC")
        .take(limit + 1)
        .getMany();

      const next =
        clubChats.length > limit ? clubChats[clubChats.length - 2].id : null;
      return {
        data: clubChats
          .slice(0, limit)
          .map((clubChat) => ClubChatConverter.toDto(clubChat)),
        next,
      };
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };
}
