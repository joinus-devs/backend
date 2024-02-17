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
import { ClubImage } from "../models/clubImage";
import CreateTables1705433210498 from "./creates";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  // logging: true,
  entities: [
    User,
    UserInClub,
    Club,
    ClubImage,
    Category,
    ClubCategory,
    Feed,
    Comment,
  ],
  migrations: [CreateTables1705433210498],
  migrationsRun: true,
});
