import { cloneDeep } from "lodash";
import swaggerJSDoc, { Parameter, Response, Schema } from "swagger-jsdoc";
import {
  signinParmasDoc,
  signupParamsDoc,
  singinResponseDoc,
  clubCreateDoc,
  clubDoc,
  clubDtoDoc,
  clubUpdateDoc,
  feedCreateDoc,
  feedDoc,
  feedDtoDoc,
  feedUpdateDoc,
  userDoc,
  userDtoDoc,
  userUpdateDoc,
} from "./docs";

class Swagger {
  private static _instance: Swagger;
  private _swagger: swaggerJSDoc.OAS3Definition;
  private static _scheme: Schema = {
    description: "common scheme",
    properties: {
      id: { type: "number", exmaple: 1 },
      created_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
      updated_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
      deleted_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
    },
  };
  private static _successResponse: Schema = {
    description: "success response",
    properties: {
      status: { type: "number", example: 200 },
      data: {},
      message: { type: "string" },
    },
  };
  private static _errorResponse: Schema = {
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
          scheme: Swagger._scheme,
          successResponse: Swagger._successResponse,
          errorResponse: Swagger._errorResponse,
          user: Swagger.makeScheme(userDoc),
          club: Swagger.makeScheme(clubDoc),
          feed: Swagger.makeScheme(feedDoc),
        },
        parameters: {
          signinParams: Swagger.makeBody(signinParmasDoc),
          signupParams: Swagger.makeBody(signupParamsDoc),
          userUpdate: Swagger.makeBody(userUpdateDoc),
          clubCreate: Swagger.makeBody(clubCreateDoc),
          clubUpdate: Swagger.makeBody(clubUpdateDoc),
          feedCreate: Swagger.makeBody(feedCreateDoc),
          feedUpdate: Swagger.makeBody(feedUpdateDoc),
        },
        responses: {
          signinResponse: Swagger.makeSuccessResponse(singinResponseDoc, false),
          userResponse: Swagger.makeSuccessResponse(userDtoDoc),
          usersResponse: Swagger.makeSuccessResponse([userDtoDoc]),
          clubResponse: Swagger.makeSuccessResponse(clubDtoDoc),
          clubsResponse: Swagger.makeSuccessResponse([clubDtoDoc]),
          feedResponse: Swagger.makeSuccessResponse(feedDtoDoc),
          feedsResponse: Swagger.makeSuccessResponse([feedDtoDoc]),
          numberResponse: Swagger.makeSuccessResponse(
            { type: "number", example: 1 },
            false,
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
    properties: { ...Swagger._scheme.properties, ...cloneDeep(data) },
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

  static makeSuccessResponse = (
    data: any,
    withScheme = true,
    isObject = true
  ): Response => {
    const newData = cloneDeep(Swagger._successResponse);
    if (Array.isArray(data)) {
      newData.properties.data = {
        type: "array",
        items: withScheme
          ? this.makeScheme(data[0])
          : isObject
            ? { properties: cloneDeep(data) }
            : data,
      };
    } else {
      newData.properties.data = withScheme
        ? this.makeScheme(data)
        : isObject
          ? { properties: cloneDeep(data) }
          : data;
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

  static makeErrorResponse = (
    data: any,
    withScheme = true,
    isObject = true
  ): Response => {
    const newData = cloneDeep(Swagger._errorResponse);
    if (Array.isArray(data)) {
      newData.properties.data = {
        type: "array",
        items: withScheme
          ? this.makeScheme(data[0])
          : isObject
            ? { properties: cloneDeep(data) }
            : data,
      };
    } else {
      newData.properties.data = withScheme
        ? this.makeScheme(data)
        : isObject
          ? { properties: cloneDeep(data) }
          : data;
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
