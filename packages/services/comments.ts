import { Repository } from "typeorm";
import {
  CommentConverter,
  CommentCreate,
  CommentDto,
  CommentUpdate,
  Feed,
} from "../models";
import { TransactionManager } from "../modules";
import { ICommentRepository, IUserRepository } from "../repositories";
import { ErrorResponse, Nullable } from "../types";

export interface ICommentService {
  find(id: number): Promise<Nullable<CommentDto>>;
  findAll(): Promise<CommentDto[]>;
  findAllByFeed(feed: number): Promise<CommentDto[]>;
  create(
    userId: number,
    feedId: number,
    commentCreate: CommentCreate
  ): Promise<number>;
  update(id: number, commentUpdate: CommentUpdate): Promise<number>;
  delete(id: number): Promise<number>;
}

export class CommentService implements ICommentService {
  private static _instance: Nullable<CommentService> = null;
  private _transactionManager: TransactionManager;
  private _commentRepository: ICommentRepository;
  private _feedRepository: Repository<Feed>;
  private _userRepository: IUserRepository;

  private constructor(
    transactionManager: TransactionManager,
    commentRepository: ICommentRepository,
    feedRepository: Repository<Feed>,
    userRepository: IUserRepository
  ) {
    this._transactionManager = transactionManager;
    this._commentRepository = commentRepository;
    this._feedRepository = feedRepository;
    this._userRepository = userRepository;
  }

  static getInstance(
    transactionManager: TransactionManager,
    commentRepository: ICommentRepository,
    feedRepository: Repository<Feed>,
    userRepository: IUserRepository
  ) {
    if (!this._instance) {
      this._instance = new CommentService(
        transactionManager,
        commentRepository,
        feedRepository,
        userRepository
      );
    }

    return this._instance;
  }

  find = async (id: number) => {
    let feed;
    try {
      feed = await this._commentRepository.find(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }

    // check if comment exists
    if (!feed) {
      throw new ErrorResponse(404, "Comment not found");
    }

    return CommentConverter.toDto(feed);
  };

  findAll = async () => {
    try {
      const comments = await this._commentRepository.findAll();
      return comments.map((comment) => CommentConverter.toDto(comment));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  findAllByFeed = async (feedId: number) => {
    try {
      const comments = await this._commentRepository.findAllByFeedId(feedId);
      return comments.map((comment) => CommentConverter.toDto(comment));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (
    userId: number,
    feedId: number,
    commentCreate: CommentCreate
  ) => {
    // check user exists
    const user = await this._userRepository.find(userId);
    if (!user) {
      throw new ErrorResponse(404, "User not found");
    }

    // check feed exists
    const feed = await this._feedRepository.findOne({
      where: { id: feedId, deleted_at: undefined },
    });
    if (!feed) {
      throw new ErrorResponse(404, "Feed not found");
    }

    try {
      return this._transactionManager.withTransaction(async () => {
        const comment = CommentConverter.toEntityFromCreate(commentCreate);
        comment.user = user;
        comment.feed = feed;
        return await this._commentRepository.create(comment);
      });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, commentUpdate: CommentUpdate) => {
    try {
      return await this._commentRepository.update(
        CommentConverter.toEntityFromUpdate(id, commentUpdate)
      );
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      return await this._commentRepository.delete(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
