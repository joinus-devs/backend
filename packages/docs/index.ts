import swaggerJSDoc, { Parameter, Response, Schema } from "swagger-jsdoc";
import { UserCreateDoc } from "./user";

class Swagger {
  private static _instance: Swagger;
  private _swagger: swaggerJSDoc.OAS3Definition;
  private _scheme: Schema = {
    description: "common scheme",
    properties: {
      id: { type: "number", exmaple: 1 },
      created_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
      updated_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
      deleted_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
    },
  };
  private _successResponse: Schema = {
    description: "success response",
    properties: {
      status: { type: "number", example: 200 },
      data: {},
      message: { type: "string" },
    },
  };
  private _errorResponse: Schema = {
    description: "error response",
    properties: {
      status: { type: "number", example: 400 },
      data: {},
      message: { type: "string" },
    },
  };

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
          Scheme: this._scheme,
          SuccessResponse: this._successResponse,
          ErrorResponse: this._errorResponse,
          User: Swagger.makeScheme(UserCreateDoc),
        },
        parameters: {
          UserCreate: Swagger.makeBody(UserCreateDoc),
          UserUpdate: Swagger.makeBody(UserCreateDoc),
        },
        responses: {
          UserResponse: Swagger.makeSuccessResponse(UserCreateDoc),
          UsersResponse: Swagger.makeSuccessResponse([UserCreateDoc]),
          NumberResponse: Swagger.makeSuccessResponse(
            { type: "number", example: 1 },
            false
          ),
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

  static makeScheme = (data: object, description?: string): Schema => ({
    description,
    properties: { ...this.getInstance()._scheme.properties, ...data },
  });

  static makeBody = (data: any, description?: string): Parameter => ({
    in: "body",
    name: "body",
    description: description || "body",
    required: true,
    schema: {
      properties: data,
    },
  });

  static makeSuccessResponse = (data: any, withScheme = true): Response => {
    const newData = { ...this.getInstance()._successResponse };
    if (Array.isArray(data)) {
      newData.properties.data = {
        type: "array",
        items: withScheme ? this.makeScheme(data[0]) : data,
      };
    } else {
      newData.properties.data = withScheme ? this.makeScheme(data) : data;
    }
    return {
      description: "success",
      content: {
        "application/json": {
          schema: newData,
        },
      },
    };
  };

  static makeErrorResponse = (data: any, withScheme = true): Response => {
    const newData = { ...this.getInstance()._errorResponse };
    if (Array.isArray(data)) {
      newData.properties.data = {
        type: "array",
        items: withScheme ? this.makeScheme(data[0]) : data,
      };
    } else {
      newData.properties.data = withScheme ? this.makeScheme(data) : data;
    }
    return {
      description: "error",
      content: {
        "application/json": {
          schema: newData,
        },
      },
    };
  };

  public add = (docs: swaggerJSDoc.Paths) => {
    this._swagger.paths = { ...this._swagger.paths, ...docs };
  };

  public get = () => {
    return this._swagger;
  };
}

export default Swagger;
