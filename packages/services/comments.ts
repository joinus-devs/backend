import { DataSource, Repository } from "typeorm";
import Errors from "../constants/errors";
import {
  Club,
  Comment,
  CommentConverter,
  CommentCreate,
  CommentDto,
  CommentUpdate,
  Feed,
  User,
  isMember,
} from "../models";
import { TransactionManager } from "../modules";
import { Nullable } from "../types";
import { CursorDto } from "./../types/response";

export interface ICommentService {
  find(id: number): Promise<Nullable<CommentDto>>;
  findAllByFeed(
    feed: number,
    cursor?: number,
    limit?: number
  ): Promise<CursorDto<CommentDto[]>>;
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
  private _clubRepository: Repository<Club>;
  private _userRepository: Repository<User>;

  private constructor(
    dataSource: DataSource,
    transactionManager: TransactionManager
  ) {
    this._transactionManager = transactionManager;
    this._commentRepository = dataSource.getRepository(Comment);
    this._feedRepository = dataSource.getRepository(Feed);
    this._clubRepository = dataSource.getRepository(Club);
    this._userRepository = dataSource.getRepository(User);
  }

  static getInstance(
    dataSource: DataSource,
    transactionManager: TransactionManager
  ) {
    if (!this._instance) {
      this._instance = new CommentService(dataSource, transactionManager);
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

  findAllByFeed = async (feedId: number, cursor?: number, limit = 10) => {
    try {
      const comments = await this._commentRepository
        .createQueryBuilder("comment")
        .leftJoinAndSelect("comment.user", "user")
        .where("comment.feed_id = :feedId", { feedId })
        .andWhere("comment.deleted_at IS NULL")
        .orderBy("comment.id", "DESC")
        .skip(cursor)
        .take(limit + 1)
        .getMany();

      const next =
        comments.length > limit ? comments[comments.length - 2].id : null;
      return {
        data: comments
          .slice(0, limit)
          .map((comment) => CommentConverter.toDto(comment)),
        next,
      };
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

    if (feed.is_private) {
      // 유저가 클럽에 가입되어 있는지 확인
      const userInClub = await this._clubRepository
        .createQueryBuilder("club")
        .leftJoinAndSelect("club.users", "user")
        .where("user.user_id = :id", { id: userId })
        .andWhere("club.id = :clubId", { clubId: feed.club_id })
        .getOne();
      if (!userInClub) {
        throw Errors.UserNotInClub;
      }
      if (!isMember(userInClub.users[0].role)) {
        throw Errors.UserNotMember;
      }
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
