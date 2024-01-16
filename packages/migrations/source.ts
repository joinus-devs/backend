import { DataSource } from "typeorm";
import { User } from "../models";
import CreateUsersTable1705424568911 from "./user";
import dotenv from "dotenv";

dotenv.config();

export default new DataSource({
  type: "mysql",
  host: "localhost",
  port: +process.env.DB_HOST!,
  username: process.env.DB_USER,
  password: "",
  database: process.env.DB_NAME,
  synchronize: false,
  // logging: true,
  entities: [User],
  migrations: [CreateUsersTable1705424568911],
});
