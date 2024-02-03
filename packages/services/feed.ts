import { Repository } from "typeorm";
import Errors from "../constants/errors";
import {
  Club,
  Feed,
  FeedConverter,
  FeedCreate,
  FeedDto,
  FeedUpdate,
  User,
} from "../models";
import { TransactionManager } from "../modules";
import { ErrorResponse, Nullable } from "../types";

export interface IFeedService {
  find(id: number): Promise<Nullable<FeedDto>>;
  findAll(): Promise<FeedDto[]>;
  findAllByClub(clubId: number): Promise<FeedDto[]>;
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
    transactionManager: TransactionManager,
    feedRepository: Repository<Feed>,
    userRepository: Repository<User>,
    clubRepository: Repository<Club>
  ) {
    this._transactionManager = transactionManager;
    this._feedRepository = feedRepository;
    this._userRepository = userRepository;
    this._clubRepository = clubRepository;
  }

  static getInstance(
    transactionManager: TransactionManager,
    feedRepository: Repository<Feed>,
    userRepository: Repository<User>,
    clubRepository: Repository<Club>
  ) {
    if (!this._instance) {
      this._instance = new FeedService(
        transactionManager,
        feedRepository,
        userRepository,
        clubRepository
      );
    }

    return this._instance;
  }

  find = async (id: number) => {
    let feed;
    try {
      feed = await this._feedRepository.findOne({
        where: { id: id, deleted_at: undefined },
        relations: ["user"],
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }

    // 피드가 없을 경우
    if (!feed) {
      throw Errors.FeedNotFound;
    }

    return FeedConverter.toDto(feed);
  };

  findAll = async () => {
    try {
      const feeds = await this._feedRepository.find({
        where: { deleted_at: undefined },
        relations: ["user"],
      });
      return feeds.map((feed) => FeedConverter.toDto(feed));
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  findAllByClub = async (clubId: number) => {
    try {
      const feeds = await this._feedRepository.find({
        where: { club_id: clubId, deleted_at: undefined },
        relations: ["user"],
      });
      return feeds.map((feed) => FeedConverter.toDto(feed));
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  create = async (userId: number, clubId: number, feedCreate: FeedCreate) => {
    // 유저가 존재하는지 확인
    const user = await this._userRepository.findOne({
      where: { id: userId, deleted_at: undefined },
    });
    if (!user) {
      throw Errors.UserNotFound;
    }

    // 클럽이 존재하는지 확인
    const club = await this._clubRepository.findOne({
      where: { id: clubId, deleted_at: undefined },
    });
    if (!club) {
      throw Errors.ClubNotFound;
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const feed = FeedConverter.toEntityFromCreate(feedCreate);
        feed.user = user;
        feed.club = club;
        const result = await manager.getRepository(Feed).save(feed);
        return result.id;
      });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw Errors.InternalServerError;
    }
  };

  update = async (id: number, feedUpdate: FeedUpdate) => {
    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const result = await manager
          .getRepository(Feed)
          .save(FeedConverter.toEntityFromUpdate(id, feedUpdate));
        return result.id;
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  delete = async (id: number) => {
    try {
      await this._feedRepository.update(id, { deleted_at: new Date() });
      return id;
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };
}
