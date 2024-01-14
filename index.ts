import dotenv from "dotenv";
import express from "express";
import AppManager from "./packages/app";
import { MysqlDatabase } from "./packages/database";
import { errorHandler, logger } from "./packages/middleware";
import { UserRouter } from "./packages/routes";

dotenv.config();
const app = express();
const port = 8000;

const database = MysqlDatabase.getInstance({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});
const appManager = AppManager.getInstance(database);
const userRouter = UserRouter.getInstance(appManager);

app.use(logger);
app.use("/users", userRouter.initRouter());
app.use(errorHandler);

app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});
