import bodyParser from "body-parser";
import express from "express";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import Swagger from "./packages/docs";
import { errorHandler, logger } from "./packages/middleware";
import { DataSource } from "./packages/migrations";
import { AppProvider } from "./packages/modules";
import initRoutes from "./packages/routes";

const main = async () => {
  const app = express();
  const port = 8000;

  await DataSource.initialize();
  const appManager = AppProvider.getInstance(DataSource);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger);
  app.use(initRoutes(appManager));
  app.use(errorHandler);
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(Swagger.getInstance().get())
  );

  app.listen(port, function () {
    console.log(`Server is listening on port ${port}`);
  });
};

main();
