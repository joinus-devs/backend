import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import AppManager from "./packages/app";
import { MysqlDatabase } from "./packages/database";
import { errorHandler, logger } from "./packages/middleware";
import initRoutes from "./packages/routes";
import swaggerFile from "./swagger-output.json";
import bodyParser = require("body-parser");

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger);
app.use(initRoutes(appManager));
app.use(errorHandler);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});
