import { ResultSetHeader, format } from "mysql2";
import { Database } from "../database";
import { UserCreate, UserUpdate } from "../models";
import { Nullable } from "../types";

class UserRepository {
  private static _instance: Nullable<UserRepository> = null;
  private _db: Database;

  private constructor(database: Database) {
    this._db = database;
  }

  static getInstance(database: Database) {
    if (!this._instance) {
      this._instance = new UserRepository(database);
    }

    return this._instance;
  }

  find = async (id: number) => {
    try {
      const query = format("SELECT * FROM users WHERE id = ?", [id]);
      const [rows] = await this._db.pool.query(query);

      return rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findAll = async () => {
    try {
      const query = format("SELECT * FROM users");
      const [rows] = await this._db.pool.query(query);

      return rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  create = async (userCreate: UserCreate) => {
    try {
      const query = format("INSERT INTO users SET ?", userCreate);
      const [results] = await this._db.pool.execute<ResultSetHeader>(query);

      return this.find(results.insertId);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  update = async (id: number, userUpdate: UserUpdate) => {
    try {
      const query = format("UPDATE users SET ? WHERE id = ?", [userUpdate, id]);
      await this._db.pool.execute<ResultSetHeader>(query);

      return this.find(id);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  delete = async (id: number) => {
    try {
      const query = format("DELETE FROM users WHERE id = ?", [id]);
      await this._db.pool.execute<ResultSetHeader>(query);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
}

export default UserRepository;
