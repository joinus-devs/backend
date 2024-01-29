import { DataSource, QueryFailedError, Repository } from "typeorm";
import { Club } from "../models";
import { ErrorResponse, Nullable } from "../types";

export interface IClubRepository {
  find(id: number): Promise<Nullable<Club>>;
  findAll(): Promise<Club[]>;
  findAllByUser(userId: number): Promise<Club[]>;
  findAllByCategory(categoryId: number): Promise<Club[]>;
  createUser(clubId: number, userId: number): Promise<number>;
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

  findAll = async () => {
    try {
      return await this._db.find({ where: { deleted_at: undefined } });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findAllByUser = async (userId: number) => {
    try {
      return await this._db
        .createQueryBuilder("club")
        .leftJoinAndSelect("club.users", "user")
        .where("user.id = :id", { id: userId, deleted_at: undefined })
        .getMany();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findAllByCategory = async (categoryId: number) => {
    try {
      return await this._db
        .createQueryBuilder("club")
        .leftJoinAndSelect("club.categories", "category")
        .where("category.id = :id", { id: categoryId, deleted_at: undefined })
        .getMany();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  createUser = async (clubId: number, userId: number) => {
    try {
      await this._db
        .createQueryBuilder()
        .relation(Club, "users")
        .of(clubId)
        .add(userId);
      return userId;
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
