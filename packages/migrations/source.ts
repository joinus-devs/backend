import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../models";
import { Club } from "../models/club";
import CreateClubTable1705433210498 from "./club";
import CreateUsersTable1705424568911 from "./user";

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
  entities: [User, Club],
  migrations: [CreateUsersTable1705424568911, CreateClubTable1705433210498],
});
