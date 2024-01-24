import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Feed, User } from "../models";
import { Club } from "../models/club";
import { UserInClub } from "../models/userInClub";
import CreateTables1705433210498 from "./creates";

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
  entities: [User, UserInClub, Club, Feed],
  migrations: [CreateTables1705433210498],
});
