import mysql, { Pool, PoolOptions } from "mysql2/promise";
import { Nullable } from "../types";
import { Database } from "./db";

class MysqlDatabase implements Database {
  private static _instance: Nullable<MysqlDatabase> = null;
  private _pool!: Pool;

  private constructor(options: PoolOptions) {
    this._pool = mysql.createPool(options);
  }

  static getInstance(options: PoolOptions) {
    if (!this._instance) {
      this._instance = new MysqlDatabase(options);
    }

    return this._instance;
  }

  public getPool() {
    return this._pool;
  }
}

export default MysqlDatabase;
