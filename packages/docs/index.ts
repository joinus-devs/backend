import swaggerJSDoc from "swagger-jsdoc";
import {
  errorDoc,
  getBodyDoc,
  getSchemeDoc,
  getSuccessDoc,
  schemeDoc,
  successDoc,
} from "./common";
import { UserCreateDoc } from "./user";

class Swagger {
  private static _instance: Swagger;
  private _swagger: swaggerJSDoc.OAS3Definition;

  private constructor() {
    this._swagger = {
      openapi: "3.0.0",
      info: {
        title: "Joinus API",
        version: "1.0.0",
        description: "Joinus API",
      },
      host: "localhost:3000",
      basePath: "/",
      components: {
        schemas: {
          Scheme: schemeDoc,
          SuccessResponse: successDoc,
          ErrorResponse: errorDoc,
          User: getSchemeDoc(UserCreateDoc),
        },
        parameters: {
          UserCreate: getBodyDoc(UserCreateDoc),
          UserUpdate: getBodyDoc(UserCreateDoc),
        },
        responses: {
          UserResponse: getSuccessDoc(UserCreateDoc),
          UsersResponse: getSuccessDoc([UserCreateDoc]),
          DeleteResponse: getSuccessDoc({ type: "number", example: 1 }, false),
        },
      },
      schemes: ["http"],
      paths: {},
    };
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new Swagger();
    }

    return this._instance;
  }

  public add = (docs: swaggerJSDoc.Paths) => {
    this._swagger.paths = { ...this._swagger.paths, ...docs };
  };

  public get = () => {
    return this._swagger;
  };
}

export default Swagger;
