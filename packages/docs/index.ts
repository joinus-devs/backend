import { cloneDeep } from "lodash";
import swaggerJSDoc, { Parameter, Response, Schema } from "swagger-jsdoc";
import { signinParmasDoc, signupParamsDoc, singinResponseDoc } from "./auth";
import {
  categoryCreateDoc,
  categoryDoc,
  categoryDtoDoc,
  categoryUpdateDoc,
} from "./category";
import { clubCreateDoc, clubDoc, clubDtoDoc, clubUpdateDoc } from "./club";
import { feedCreateDoc, feedDoc, feedDtoDoc, feedUpdateDoc } from "./feed";
import { userDoc, userDtoDoc, userUpdateDoc } from "./user";

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
          category: Swagger.makeScheme(categoryDoc),
          feed: Swagger.makeScheme(feedDoc),
        },
        parameters: {
          signinParams: Swagger.makeBody(signinParmasDoc),
          signupParams: Swagger.makeBody(signupParamsDoc),
          userUpdate: Swagger.makeBody(userUpdateDoc),
          clubCreate: Swagger.makeBody(clubCreateDoc),
          clubUpdate: Swagger.makeBody(clubUpdateDoc),
          categoryCreate: Swagger.makeBody(categoryCreateDoc),
          categoryUpdate: Swagger.makeBody(categoryUpdateDoc),
          feedCreate: Swagger.makeBody(feedCreateDoc),
          feedUpdate: Swagger.makeBody(feedUpdateDoc),
        },
        responses: {
          signinResponse: Swagger.makeSuccessResponse(singinResponseDoc),
          userResponse: Swagger.makeSuccessResponse(
            Swagger.makeScheme(userDtoDoc)
          ),
          usersResponse: Swagger.makeSuccessResponse(
            Swagger.makeArrayScheme(userDtoDoc)
          ),
          clubResponse: Swagger.makeSuccessResponse(
            Swagger.makeScheme(clubDtoDoc)
          ),
          clubsResponse: Swagger.makeSuccessResponse(
            Swagger.makeArrayScheme(clubDtoDoc)
          ),
          categoryResponse: Swagger.makeSuccessResponse(
            Swagger.makeScheme(categoryDtoDoc)
          ),
          categoriesResponse: Swagger.makeSuccessResponse(
            Swagger.makeArrayScheme(categoryDtoDoc)
          ),
          feedResponse: Swagger.makeSuccessResponse(
            Swagger.makeScheme(feedDtoDoc)
          ),
          feedsResponse: Swagger.makeSuccessResponse(
            Swagger.makeArrayScheme(feedDtoDoc)
          ),
          numberResponse: Swagger.makeSuccessResponse({
            type: "number",
            example: 1,
          }),
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

  static makeScheme = (data: object): Schema => ({
    type: "object",
    properties: { ...Swagger._scheme.properties, ...cloneDeep(data) },
  });

  static makeArrayScheme = (data: object): Schema => ({
    type: "array",
    items: {
      properties: { ...Swagger._scheme.properties, ...cloneDeep(data) },
    },
  });

  static makeBody = (schema: Schema, description?: string): Parameter => ({
    in: "body",
    name: "body",
    description: description || "body",
    required: true,
    schema: {
      properties: schema,
    },
  });

  static makeSuccessResponse = (schema: Schema): Response => {
    const newData = cloneDeep(Swagger._successResponse);
    newData.properties.data = cloneDeep(schema);
    return Swagger.makeResponse(newData, "success");
  };

  static makeErrorResponse = (schema: Schema): Response => {
    const newData = cloneDeep(Swagger._errorResponse);
    newData.properties.data = cloneDeep(schema);
    return Swagger.makeResponse(newData, "error");
  };

  static makeResponse = (schema: Schema, description?: string): Response => ({
    description: description || "response",
    content: { "application/json": { schema: schema } },
  });

  public add = (docs: swaggerJSDoc.Paths) => {
    this._swagger.paths = { ...this._swagger.paths, ...docs };
  };

  public get = () => {
    return this._swagger;
  };
}

export default Swagger;
