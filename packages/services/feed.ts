import { FeedConverter, FeedCreate, FeedDto, FeedUpdate } from "../models";
import { TransactionManager } from "../modules";
import { IClubRepository, IUserRepository } from "../repositories";
import { IFeedRepository } from "../repositories/feed";
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
  private _feedRepository: IFeedRepository;
  private _userRepository: IUserRepository;
  private _clubRepository: IClubRepository;

  private constructor(
    transactionManager: TransactionManager,
    feedRepository: IFeedRepository,
    userRepository: IUserRepository,
    clubRepository: IClubRepository
  ) {
    this._transactionManager = transactionManager;
    this._feedRepository = feedRepository;
    this._userRepository = userRepository;
    this._clubRepository = clubRepository;
  }

  static getInstance(
    transactionManager: TransactionManager,
    feedRepository: IFeedRepository,
    userRepository: IUserRepository,
    clubRepository: IClubRepository
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
      feed = await this._feedRepository.find(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }

    // check feed exists
    if (!feed) {
      throw new ErrorResponse(404, "Feed not found");
    }

    return FeedConverter.toDto(feed);
  };

  findAll = async () => {
    try {
      const feeds = await this._feedRepository.findAll();
      return feeds.map((feed) => FeedConverter.toDto(feed));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  findAllByClub = async (clubId: number) => {
    try {
      const feeds = await this._feedRepository.findAllByClubId(clubId);
      return feeds.map((feed) => FeedConverter.toDto(feed));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (userId: number, clubId: number, feedCreate: FeedCreate) => {
    // check user exists
    const user = await this._userRepository.find(userId);
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }

    // check club exists
    const club = await this._clubRepository.find(clubId);
    if (!club) {
      throw new ErrorResponse(404, "Club not found");
    }

    try {
      return this._transactionManager.withTransaction(async () => {
        const feed = FeedConverter.toEntityFromCreate(feedCreate);
        feed.user = user;
        feed.club = club;
        return await this._feedRepository.create(feed);
      });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, feedUpdate: FeedUpdate) => {
    try {
      return await this._feedRepository.update(
        FeedConverter.toEntityFromUpdate(id, feedUpdate)
      );
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      return await this._feedRepository.delete(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
