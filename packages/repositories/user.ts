import { Database } from "../database";
import { Nullable } from "../types";

class UserRepository {
  private static _instance: Nullable<UserRepository> = null;
  private _database: Database;

  private constructor(database: Database) {
    this._database = database;
  }

  static getInstance(database: Database) {
    if (!this._instance) {
      this._instance = new UserRepository(database);
    }

    return this._instance;
  }

  getUsers = async () => {
    try {
      const [rows] = await this._database
        .getPool()
        .query({ sql: "SELECT * FROM users LIMIT 1" });
      return rows;
    } catch (err) {
      throw err;
    }
  };
}

export default UserRepository;
