import { DataSource, QueryFailedError, Repository } from "typeorm";
import { User } from "../models";
import { ErrorResponse, Nullable } from "../types";

export interface IUserRepository {
  find(id: number): Promise<Nullable<User>>;
  findByEmail(email: string): Promise<Nullable<User>>;
  findWithClubs(id: number): Promise<Nullable<User>>;
  findAll(): Promise<User[]>;
  findAllByClubId(clubId: number): Promise<User[]>;
  create(user: User): Promise<number>;
  update(user: User): Promise<number>;
  delete(id: number): Promise<number>;
}

export class UserRepository implements IUserRepository {
  private static _instance: Nullable<IUserRepository> = null;
  private _db: Repository<User>;

  private constructor(datasource: DataSource) {
    this._db = datasource.getRepository(User);
  }

  static getInstance(datasource: DataSource) {
    if (!this._instance) {
      this._instance = new UserRepository(datasource);
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

  findByEmail = async (email: string) => {
    try {
      return await this._db.findOne({ where: { email } });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findWithClubs = async (id: number) => {
    try {
      return await this._db.findOne({
        where: { id },
        relations: ["clubs"],
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findAllByClubId = async (clubId: number) => {
    try {
      return await this._db
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.clubs", "club")
        .where("club.id = :id", { id: clubId })
        .getMany();
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

  create = async (user: User) => {
    try {
      const result = await this._db.save(user);
      return result.id;
    } catch (err) {
      console.log(err);
      if (err instanceof QueryFailedError && err.driverError.errno === 1062) {
        throw new ErrorResponse(409, "Unique constraint error");
      }
      throw err;
    }
  };

  update = async (user: User) => {
    try {
      const result = await this._db.save(user);
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
