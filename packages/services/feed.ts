import { DataSource, Repository } from "typeorm";
import Errors from "../constants/errors";
import {
  Club,
  Feed,
  FeedConverter,
  FeedCreate,
  FeedDto,
  FeedUpdate,
  User,
  isMember,
} from "../models";
import { TransactionManager } from "../modules";
import { CursorDto, ErrorResponse, Nullable } from "../types";

export interface IFeedService {
  find(id: number): Promise<Nullable<FeedDto>>;
  findAll(cursor?: number, limit?: number): Promise<CursorDto<FeedDto[]>>;
  findAllByClub(
    clubId: number,
    cursor?: number,
    limit?: number
  ): Promise<CursorDto<FeedDto[]>>;
  create(
    userId: number,
    clubId: number,
    clubCreate: FeedCreate
  ): Promise<number>;
  update(id: number, clubUpdate: FeedUpdate): Promise<number>;
  delete(id: number): Promise<number>;
}

export class FeedService implements IFeedService {
  private static _instance: Nullable<FeedService> = null;
  private _transactionManager: TransactionManager;
  private _feedRepository: Repository<Feed>;
  private _userRepository: Repository<User>;
  private _clubRepository: Repository<Club>;

  private constructor(
    dataSoruce: DataSource,
    transactionManager: TransactionManager
  ) {
    this._transactionManager = transactionManager;
    this._feedRepository = dataSoruce.getRepository(Feed);
    this._userRepository = dataSoruce.getRepository(User);
    this._clubRepository = dataSoruce.getRepository(Club);
  }

  static getInstance(
    dataSoruce: DataSource,
    transactionManager: TransactionManager
  ) {
    if (!this._instance) {
      this._instance = new FeedService(dataSoruce, transactionManager);
    }

    return this._instance;
  }

  find = async (id: number) => {
    let feed;
    try {
      feed = await this._feedRepository
        .createQueryBuilder("feed")
        .leftJoinAndSelect("feed.user", "user")
        .leftJoinAndSelect("feed.club", "club")
        .leftJoinAndSelect("club.categories", "club_category")
        .leftJoin("feed.comments", "comment")
        .addSelect("COUNT(comment.id)", "feed_comment_count")
        .where("feed.id = :id", { id })
        .andWhere("feed.deleted_at IS NULL")
        .groupBy("feed.id")
        .addGroupBy("club.id")
        .addGroupBy("club_category.category_id")
        .getOne();
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }

    // 피드가 없을 경우
    if (!feed) {
      throw Errors.FeedNotFound.clone();
    }

    return FeedConverter.toWithClubDto(feed);
  };

  findAll = async (cursor?: number, limit = 10) => {
    try {
      const feeds = await this._feedRepository
        .createQueryBuilder("feed")
        .leftJoinAndSelect("feed.user", "user")
        .leftJoinAndSelect("feed.club", "club")
        .leftJoinAndSelect("club.categories", "club_category")
        .leftJoinAndSelect("club.images", "image")
        .leftJoin("feed.comments", "comment")
        .addSelect("COUNT(comment.id)", "feed_comment_count")
        .where("feed.is_private = false")
        .andWhere("feed.deleted_at IS NULL")
        .andWhere(cursor ? "feed.id < :cursor" : "1=1", { cursor })
        .groupBy("feed.id")
        .addGroupBy("club.id")
        .addGroupBy("club_category.category_id")
        .addGroupBy("image.id")
        .orderBy("feed.id", "DESC")
        .take(limit + 1)
        .getMany();
      const next = feeds.length > limit ? feeds[feeds.length - 2].id : null;
      return {
        data: feeds
          .slice(0, limit)
          .map((feed) => FeedConverter.toWithClubDto(feed)),
        next,
      };
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };

  findAllByClub = async (clubId: number, cursor?: number, limit = 10) => {
    try {
      const feeds = await this._feedRepository
        .createQueryBuilder("feed")
        .leftJoinAndSelect("feed.user", "user")
        .leftJoin("feed.comments", "comment")
        .addSelect("COUNT(comment.id)", "feed_comment_count")
        .where("feed.club_id = :clubId", { clubId })
        .andWhere("feed.deleted_at IS NULL")
        .andWhere(cursor ? "feed.id < :cursor" : "1=1", { cursor })
        .groupBy("feed.id")
        .orderBy("feed.id", "DESC")
        .take(limit + 1)
        .getMany();
      const next = feeds.length > limit ? feeds[feeds.length - 2].id : null;
      return {
        data: feeds.slice(0, limit).map((feed) => FeedConverter.toDto(feed)),
        next,
      };
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };

  create = async (userId: number, clubId: number, feedCreate: FeedCreate) => {
    // 유저가 존재하는지 확인
    const user = await this._userRepository.findOne({
      where: { id: userId, deleted_at: undefined },
    });
    if (!user) {
      throw Errors.UserNotFound.clone();
    }

    // 클럽이 존재하는지 확인
    const club = await this._clubRepository.findOne({
      where: { id: clubId, deleted_at: undefined },
    });
    if (!club) {
      throw Errors.ClubNotFound.clone();
    }

    // 유저가 클럽에 가입되어 있는지 확인
    const userInClub = await this._clubRepository
      .createQueryBuilder("club")
      .leftJoinAndSelect("club.users", "user")
      .where("user.user_id = :id", { id: userId })
      .andWhere("club.id = :clubId", { clubId })
      .getOne();
    if (!userInClub) {
      throw Errors.UserNotInClub.clone();
    }
    if (!isMember(userInClub.users[0].role)) {
      throw Errors.UserNotMember.clone();
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const feed = FeedConverter.fromCreate(feedCreate);
        feed.user = user;
        feed.club = club;
        const result = await manager.getRepository(Feed).save(feed);
        return result.id;
      });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw Errors.makeInternalServerError(err);
    }
  };

  update = async (id: number, feedUpdate: FeedUpdate) => {
    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const result = await manager
          .getRepository(Feed)
          .save(FeedConverter.fromUpdate(id, feedUpdate));
        return result.id;
      });
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };

  delete = async (id: number) => {
    try {
      await this._feedRepository.update(id, { deleted_at: new Date() });
      return id;
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };
}
