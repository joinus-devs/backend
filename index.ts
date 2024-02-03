import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import Docs from "./packages/docs";
import { authenticator, errorHandler, logger } from "./packages/middleware";
import { DataSource } from "./packages/migrations";
import { AppProvider } from "./packages/modules";
import initRoutes from "./packages/routes";

let retries = 10;

const connectDB = async () => {
  try {
    await DataSource.initialize();
  } catch (error) {
    console.log(error);
    retries -= 1;
    console.log(`retries left: ${retries}`);
    if (retries === 0) {
      throw new Error("Cannot connect to database");
    } else {
      await new Promise((res) => setTimeout(res, 5000));
    }
    await connectDB();
  }
};

const main = async () => {
  const app = express();
  const port = 8000;

  await connectDB();
  const appManager = AppProvider.getInstance(DataSource);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(logger);
  app.use(authenticator);
  app.use(initRoutes(appManager));
  app.use(errorHandler);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(Docs.getInstance().get()));

  app.listen(port, function () {
    console.log(`Server is listening on port ${port}`);
  });
};

main();
