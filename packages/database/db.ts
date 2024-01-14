import { Pool } from "mysql2/promise";

export interface Database {
  pool: Pool;
}
