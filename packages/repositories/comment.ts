import { DataSource, QueryFailedError, Repository } from "typeorm";
import { Comment } from "../models";
import { ErrorResponse, Nullable } from "../types";

export interface ICommentRepository {
  find(id: number): Promise<Nullable<Comment>>;
  findAll(): Promise<Comment[]>;
  findAllByFeedId(clubId: number): Promise<Comment[]>;
  create(comment: Comment): Promise<number>;
  update(comment: Comment): Promise<number>;
  delete(id: number): Promise<number>;
}

export class CommentRepository implements ICommentRepository {
  private static _instance: Nullable<ICommentRepository> = null;
  private _db: Repository<Comment>;

  private constructor(datasource: DataSource) {
    this._db = datasource.getRepository(Comment);
  }

  static getInstance(datasource: DataSource) {
    if (!this._instance) {
      this._instance = new CommentRepository(datasource);
    }

    return this._instance;
  }

  find = async (id: number) => {
    try {
      return await this._db.findOne({
        where: { id },
        relations: ["user"],
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findAll = async () => {
    try {
      return await this._db.find({
        where: { deleted_at: undefined },
        relations: ["user"],
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findAllByFeedId = async (feedId: number) => {
    try {
      return await this._db.find({
        where: { feed_id: feedId, deleted_at: undefined },
        relations: ["user"],
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  create = async (comment: Comment) => {
    try {
      const result = await this._db.save(comment);
      return result.id;
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.errno === 1062) {
        throw new ErrorResponse(409, "Unique constraint error");
      }
      throw err;
    }
  };

  update = async (comment: Comment) => {
    try {
      const result = await this._db.save(comment);
      return result.id;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  delete = async (id: number) => {
    try {
      await this._db.update(id, { deleted_at: new Date() });
      return id;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
}
