import { DataSource, QueryFailedError, Repository } from "typeorm";
import { Feed } from "../models";
import { ErrorResponse, Nullable } from "../types";

export interface IFeedRepository {
  find(id: number): Promise<Nullable<Feed>>;
  findAll(): Promise<Feed[]>;
  findAllByClubId(clubId: number): Promise<Feed[]>;
  create(feed: Feed): Promise<number>;
  update(feed: Feed): Promise<number>;
  delete(id: number): Promise<number>;
}

export class FeedRepository implements IFeedRepository {
  private static _instance: Nullable<IFeedRepository> = null;
  private _db: Repository<Feed>;

  private constructor(datasource: DataSource) {
    this._db = datasource.getRepository(Feed);
  }

  static getInstance(datasource: DataSource) {
    if (!this._instance) {
      this._instance = new FeedRepository(datasource);
    }

    return this._instance;
  }

  find = async (id: number) => {
    try {
      return await this._db.findOne({
        where: { id },
        relations: ["user", "club"],
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
        relations: ["user", "club"],
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findAllByClubId = async (clubId: number) => {
    try {
      return await this._db.find({
        where: { club_id: clubId, deleted_at: undefined },
        relations: ["user"],
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  create = async (feed: Feed) => {
    try {
      const result = await this._db.save(feed);
      return result.id;
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.errno === 1062) {
        throw new ErrorResponse(409, "Unique constraint error");
      }
      throw err;
    }
  };

  update = async (feed: Feed) => {
    try {
      const result = await this._db.save(feed);
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
