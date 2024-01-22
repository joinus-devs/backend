import { DataSource, QueryFailedError, Repository } from "typeorm";
import { Club } from "../models";
import { ErrorResponse, Nullable } from "../types";

export interface IClubRepository {
  find(id: number): Promise<Nullable<Club>>;
  findWithUsers(id: number): Promise<Nullable<Club>>;
  findAll(): Promise<Club[]>;
  create(club: Club): Promise<number>;
  update(club: Club): Promise<number>;
  delete(id: number): Promise<number>;
}

export class ClubRepository implements IClubRepository {
  private static _instance: Nullable<IClubRepository> = null;
  private _db: Repository<Club>;

  private constructor(datasource: DataSource) {
    this._db = datasource.getRepository(Club);
  }

  static getInstance(datasource: DataSource) {
    if (!this._instance) {
      this._instance = new ClubRepository(datasource);
    }

    return this._instance;
  }

  find = async (id: number) => {
    try {
      return await this._db.findOne({ where: { id } });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findWithUsers = async (id: number) => {
    try {
      return await this._db.findOne({
        where: { id },
        relations: ["users"],
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findAll = async () => {
    try {
      return await this._db.find({ where: { deleted_at: undefined } });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  create = async (club: Club) => {
    try {
      const result = await this._db.save(club);
      return result.id;
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.errno === 1062) {
        throw new ErrorResponse(409, "Unique constraint error");
      }
      throw err;
    }
  };

  update = async (club: Club) => {
    try {
      const result = await this._db.save(club);
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
