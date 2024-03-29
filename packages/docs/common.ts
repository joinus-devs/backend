import { cloneDeep } from "lodash";
import { Parameter, Response, Schema } from "swagger-jsdoc";
import { IdEntity } from "../models/common";

export type CoreData<T> = Omit<T, keyof IdEntity>;

export type CoreSchema<T> = {
  [key in keyof CoreData<T>]: Schema[keyof Schema];
};

export const scheme: Schema = {
  description: "common scheme",
  properties: {
    id: { type: "number", exmaple: 1 },
    created_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
    updated_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
    deleted_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
  },
};

export const successResponse: Schema = {
  description: "success response",
  properties: {
    status: { type: "number", example: 200 },
    data: {},
    message: { type: "string" },
  },
};

export const errorResponse: Schema = {
  description: "error response",
  properties: {
    status: { type: "number", example: 400 },
    data: {},
    message: { type: "string" },
  },
};

export const cursorParamDoc: Parameter = {
  in: "query",
  name: "cursor",
  required: false,
  schema: {
    type: "number",
  },
};

export const limnitParamDoc: Parameter = {
  in: "query",
  name: "limit",
  required: false,
  schema: {
    type: "number",
  },
};

export const makeScheme = (data: object): Schema => ({
  type: "object",
  properties: { ...scheme.properties, ...cloneDeep(data) },
});

export const makeArray = (data: object): Schema => ({
  type: "array",
  items: {
    properties: { ...scheme.properties, ...cloneDeep(data) },
  },
});

export const makeCursor = (data: object) => ({
  type: "object",
  properties: {
    next: { type: "number", example: 1 },
    data: makeArray(data),
  },
});

export const makeBody = (schema: Schema, description?: string): Parameter => ({
  in: "body",
  name: "body",
  description: description || "body",
  required: true,
  schema: {
    properties: schema,
  },
});

export const makeResponse = (
  schema: Schema,
  description?: string
): Response => ({
  description: description || "response",
  content: { "application/json": { schema: schema } },
});

export const makeSuccess = (schema: Schema): Response => {
  const newData = cloneDeep(successResponse);
  newData.properties.data = cloneDeep(schema);
  return makeResponse(newData, "success");
};

export const makeError = (schema: Schema): Response => {
  const newData = cloneDeep(errorResponse);
  newData.properties.data = cloneDeep(schema);
  return makeResponse(newData, "error");
};
