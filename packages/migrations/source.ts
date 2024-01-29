import dotenv from "dotenv";
import { DataSource } from "typeorm";
import {
  Category,
  Club,
  ClubCategory,
  Comment,
  Feed,
  User,
  UserInClub,
} from "../models";
import CreateTables1705433210498 from "./creates";

dotenv.config();

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  // logging: true,
  entities: [User, UserInClub, Club, Category, ClubCategory, Feed, Comment],
  migrations: [CreateTables1705433210498],
});
