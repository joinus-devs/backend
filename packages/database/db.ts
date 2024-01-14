import { Pool } from "mysql2/promise";

export interface Database {
  getPool(): Pool;
}
