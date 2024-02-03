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
import { commentCreateDoc, commentDtoDoc, commentUpdateDoc } from "./comment";
import { feedCreateDoc, feedDoc, feedDtoDoc, feedUpdateDoc } from "./feed";
import { userDoc, userDtoDoc, userUpdateDoc } from "./user";

class Docs {
  private static _instance: Docs;
  private _swaggerDocs: swaggerJSDoc.OAS3Definition;
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
    this._swaggerDocs = {
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
          scheme: Docs._scheme,
          successResponse: Docs._successResponse,
          errorResponse: Docs._errorResponse,
          user: Docs.makeScheme(userDoc),
          club: Docs.makeScheme(clubDoc),
          category: Docs.makeScheme(categoryDoc),
          feed: Docs.makeScheme(feedDoc),
        },
        parameters: {
          signinParams: Docs.makeBody(signinParmasDoc),
          signupParams: Docs.makeBody(signupParamsDoc),
          userUpdate: Docs.makeBody(userUpdateDoc),
          clubCreate: Docs.makeBody(clubCreateDoc),
          clubUpdate: Docs.makeBody(clubUpdateDoc),
          categoryCreate: Docs.makeBody(categoryCreateDoc),
          categoryUpdate: Docs.makeBody(categoryUpdateDoc),
          feedCreate: Docs.makeBody(feedCreateDoc),
          feedUpdate: Docs.makeBody(feedUpdateDoc),
          commentCreate: Docs.makeBody(commentCreateDoc),
          commentUpdate: Docs.makeBody(commentUpdateDoc),
        },
        responses: {
          signinResponse: Docs.makeSuccess(singinResponseDoc),
          userResponse: Docs.makeSuccess(Docs.makeScheme(userDtoDoc)),
          usersResponse: Docs.makeSuccess(Docs.makeArray(userDtoDoc)),
          clubResponse: Docs.makeSuccess(Docs.makeScheme(clubDtoDoc)),
          clubsResponse: Docs.makeSuccess(Docs.makeArray(clubDtoDoc)),
          categoryResponse: Docs.makeSuccess(Docs.makeScheme(categoryDtoDoc)),
          categoriesResponse: Docs.makeSuccess(Docs.makeArray(categoryDtoDoc)),
          feedResponse: Docs.makeSuccess(Docs.makeScheme(feedDtoDoc)),
          feedsResponse: Docs.makeSuccess(Docs.makeArray(feedDtoDoc)),
          commentResponse: Docs.makeSuccess(Docs.makeScheme(commentDtoDoc)),
          commentsResponse: Docs.makeSuccess(Docs.makeArray(commentDtoDoc)),
          numberResponse: Docs.makeSuccess({
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
      this._instance = new Docs();
    }

    return this._instance;
  }

  static makeScheme = (data: object): Schema => ({
    type: "object",
    properties: { ...Docs._scheme.properties, ...cloneDeep(data) },
  });

  static makeArray = (data: object): Schema => ({
    type: "array",
    items: {
      properties: { ...Docs._scheme.properties, ...cloneDeep(data) },
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

  static makeSuccess = (schema: Schema): Response => {
    const newData = cloneDeep(Docs._successResponse);
    newData.properties.data = cloneDeep(schema);
    return Docs.makeResponse(newData, "success");
  };

  static makeError = (schema: Schema): Response => {
    const newData = cloneDeep(Docs._errorResponse);
    newData.properties.data = cloneDeep(schema);
    return Docs.makeResponse(newData, "error");
  };

  static makeResponse = (schema: Schema, description?: string): Response => ({
    description: description || "response",
    content: { "application/json": { schema: schema } },
  });

  public add = (docs: swaggerJSDoc.Paths) => {
    this._swaggerDocs.paths = { ...this._swaggerDocs.paths, ...docs };
  };

  public get = () => {
    return this._swaggerDocs;
  };
}

export default Docs;
