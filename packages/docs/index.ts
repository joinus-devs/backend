import { cloneDeep } from "lodash";
import swaggerJSDoc, { Parameter, Response, Schema } from "swagger-jsdoc";
import { SigninParmasDoc, SignupParamsDoc, SinginResponseDoc } from "./auth";
import { ClubCreateDoc, ClubDoc, ClubDtoDoc, ClubUpdateDoc } from "./club";
import { UserDoc, UserDtoDoc, UserUpdateDoc } from "./user";

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
          Scheme: Swagger._scheme,
          SuccessResponse: Swagger._successResponse,
          ErrorResponse: Swagger._errorResponse,
          User: Swagger.makeScheme(UserDoc),
          Club: Swagger.makeScheme(ClubDoc),
        },
        parameters: {
          SigninParams: Swagger.makeBody(SigninParmasDoc),
          SignupParams: Swagger.makeBody(SignupParamsDoc),
          UserUpdate: Swagger.makeBody(UserUpdateDoc),
          ClubCreate: Swagger.makeBody(ClubCreateDoc),
          ClubUpdate: Swagger.makeBody(ClubUpdateDoc),
        },
        responses: {
          SigninResponse: Swagger.makeSuccessResponse(SinginResponseDoc, false),
          UserResponse: Swagger.makeSuccessResponse(UserDtoDoc),
          UsersResponse: Swagger.makeSuccessResponse([UserDtoDoc]),
          ClubResponse: Swagger.makeSuccessResponse(ClubDtoDoc),
          ClubsResponse: Swagger.makeSuccessResponse([ClubDtoDoc]),
          NumberResponse: Swagger.makeSuccessResponse(
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
    const newData = { ...cloneDeep(Swagger._successResponse) };
    if (Array.isArray(data)) {
      newData.properties.data = {
        type: "array",
        items: withScheme
          ? this.makeScheme(data[0])
          : isObject
            ? { properties: { ...cloneDeep(data) } }
            : data,
      };
    } else {
      newData.properties.data = withScheme
        ? this.makeScheme(data)
        : isObject
          ? { properties: { ...cloneDeep(data) } }
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
    const newData = { ...cloneDeep(Swagger._errorResponse) };
    if (Array.isArray(data)) {
      newData.properties.data = {
        type: "array",
        items: withScheme
          ? this.makeScheme(data[0])
          : isObject
            ? { properties: { ...cloneDeep(data) } }
            : data,
      };
    } else {
      newData.properties.data = withScheme
        ? this.makeScheme(data)
        : isObject
          ? { properties: { ...cloneDeep(data) } }
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
