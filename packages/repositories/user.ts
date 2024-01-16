import { DataSource, Repository } from "typeorm";
import { User, UserCreate, UserUpdate } from "../models";
import { Maybe, Nullable } from "../types";

export interface IUserRepository {
  find(id: number): Promise<Nullable<User>>;
  findAll(): Promise<User[]>;
  create(userCreate: UserCreate): Promise<Nullable<User>>;
  update(id: number, userUpdate: UserUpdate): Promise<Nullable<User>>;
  delete(id: number): Promise<Maybe<number>>;
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

  findAll = async () => {
    try {
      return await this._db.find();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  create = async (userCreate: UserCreate) => {
    try {
      const result = await this._db.insert(userCreate);
      const insertedId = result.identifiers[0].id as number;
      return this.find(insertedId);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  update = async (id: number, userUpdate: UserUpdate) => {
    try {
      await this._db.update(id, userUpdate);
      return this.find(id);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  delete = async (id: number) => {
    try {
      await this._db.delete(id);
      return id;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
}
