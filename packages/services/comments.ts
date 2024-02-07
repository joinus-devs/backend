import { Repository } from "typeorm";
import Errors from "../constants/errors";
import {
  Comment,
  CommentConverter,
  CommentCreate,
  CommentDto,
  CommentUpdate,
  Feed,
  User,
} from "../models";
import { TransactionManager } from "../modules";
import { Nullable } from "../types";

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
  private _commentRepository: Repository<Comment>;
  private _feedRepository: Repository<Feed>;
  private _userRepository: Repository<User>;

  private constructor(
    transactionManager: TransactionManager,
    commentRepository: Repository<Comment>,
    feedRepository: Repository<Feed>,
    userRepository: Repository<User>
  ) {
    this._transactionManager = transactionManager;
    this._commentRepository = commentRepository;
    this._feedRepository = feedRepository;
    this._userRepository = userRepository;
  }

  static getInstance(
    transactionManager: TransactionManager,
    commentRepository: Repository<Comment>,
    feedRepository: Repository<Feed>,
    userRepository: Repository<User>
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
    let comment;
    try {
      comment = await this._commentRepository.findOne({
        where: { id },
        relations: ["user"],
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }

    // 댓글이 없을 경우
    if (!comment) {
      throw Errors.CommentNotFound;
    }

    return CommentConverter.toDto(comment);
  };

  findAll = async () => {
    try {
      const comments = await this._commentRepository.find({
        where: { deleted_at: undefined },
        relations: ["user"],
      });
      return comments.map((comment) => CommentConverter.toDto(comment));
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  findAllByFeed = async (feedId: number) => {
    try {
      const comments = await this._commentRepository.find({
        where: { feed_id: feedId, deleted_at: undefined },
        relations: ["user"],
      });
      return comments.map((comment) => CommentConverter.toDto(comment));
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  create = async (
    userId: number,
    feedId: number,
    commentCreate: CommentCreate
  ) => {
    // 유저가 존재하는지 확인
    const user = await this._userRepository.findOne({
      where: { id: userId, deleted_at: undefined },
    });
    if (!user) {
      throw Errors.UserNotFound;
    }

    // 피드가 존재하는지 확인
    const feed = await this._feedRepository.findOne({
      where: { id: feedId, deleted_at: undefined },
    });
    if (!feed) {
      throw Errors.FeedNotFound;
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const comment = CommentConverter.fromCreate(commentCreate);
        comment.user = user;
        comment.feed = feed;
        const result = await manager.getRepository(Comment).save(comment);
        return result.id;
      });
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  update = async (id: number, commentUpdate: CommentUpdate) => {
    try {
      const result = await this._commentRepository.save(
        CommentConverter.fromUpdate(id, commentUpdate)
      );
      return result.id;
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };

  delete = async (id: number) => {
    try {
      await this._commentRepository.update(id, {
        deleted_at: new Date(),
      });
      return id;
    } catch (err) {
      throw Errors.InternalServerError;
    }
  };
}
