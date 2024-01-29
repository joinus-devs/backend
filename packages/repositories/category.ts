import { DataSource, QueryFailedError, Repository } from "typeorm";
import { Category } from "../models";
import { ErrorResponse, Nullable } from "../types";

export interface ICategoryRepository {
  find(id: number): Promise<Nullable<Category>>;
  findAll(): Promise<Category[]>;
  create(category: Category): Promise<number>;
  update(category: Category): Promise<number>;
  delete(id: number): Promise<number>;
}

export class CategoryRepository implements ICategoryRepository {
  private static _instance: Nullable<ICategoryRepository> = null;
  private _db: Repository<Category>;

  private constructor(datasource: DataSource) {
    this._db = datasource.getRepository(Category);
  }

  static getInstance(datasource: DataSource) {
    if (!this._instance) {
      this._instance = new CategoryRepository(datasource);
    }

    return this._instance;
  }

  find = async (id: number) => {
    try {
      return await this._db.findOne({
        where: { id },
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
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  create = async (category: Category) => {
    try {
      const result = await this._db.save(category);
      return result.id;
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.errno === 1062) {
        throw new ErrorResponse(409, "Unique constraint error");
      }
      throw err;
    }
  };

  update = async (category: Category) => {
    try {
      const result = await this._db.save(category);
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
