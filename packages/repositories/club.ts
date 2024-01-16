import { DataSource, Repository } from "typeorm";
import { Club, ClubCreate, ClubUpdate } from "../models";
import { Maybe, Nullable } from "../types";

export interface IClubRepository {
  find(id: number): Promise<Nullable<Club>>;
  findAll(): Promise<Club[]>;
  create(clubCreate: ClubCreate): Promise<Nullable<Club>>;
  update(id: number, clubUpdate: ClubUpdate): Promise<Nullable<Club>>;
  delete(id: number): Promise<Maybe<number>>;
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

  create = async (clupCreate: ClubCreate) => {
    try {
      const result = await this._db.insert(clupCreate);
      const insertedId = result.identifiers[0].id as number;
      return this.find(insertedId);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  update = async (id: number, clubUpdate: ClubUpdate) => {
    try {
      await this._db.update(id, clubUpdate);
      return this.find(id);
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
