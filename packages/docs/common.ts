import { cloneDeep } from "lodash";
import swaggerJSDoc from "swagger-jsdoc";

export const schemeDoc = {
  description: "common scheme",
  properties: {
    id: { type: "number", exmaple: 1 },
    created_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
    updated_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
    deleted_at: { type: "string", example: "2020-01-01T00:00:00.000Z" },
  },
};

export const successDoc = {
  description: "success response",
  properties: {
    status: { type: "number", example: 200 },
    data: {},
    message: { type: "string" },
  },
};

export const errorDoc = {
  description: "error response",
  properties: {
    status: { type: "number", example: 400 },
    data: {},
    message: { type: "string" },
  },
};

export const getSchemeDoc = (data: object): swaggerJSDoc.Schema => ({
  properties: { ...cloneDeep(schemeDoc.properties), ...cloneDeep(data) },
});

export const getBodyDoc = (data: any): swaggerJSDoc.Parameter => ({
  in: "body",
  name: "body",
  description: "body",
  required: true,
  schema: {
    properties: data,
  },
});

export const getSuccessDoc = (
  data: any,
  withScheme = true
): swaggerJSDoc.Response => {
  const newData = cloneDeep(successDoc);
  if (Array.isArray(data)) {
    newData.properties.data = {
      type: "array",
      items: withScheme ? getSchemeDoc(data[0]) : cloneDeep(data),
    };
  } else {
    newData.properties.data = withScheme ? getSchemeDoc(data) : cloneDeep(data);
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

export const getErrorDoc = (
  data: any,
  withScheme = true
): swaggerJSDoc.Response => {
  const newData = cloneDeep(successDoc);
  if (Array.isArray(data)) {
    newData.properties.data = {
      type: "array",
      items: withScheme ? getSchemeDoc(data[0]) : cloneDeep(data),
    };
  } else {
    newData.properties.data = withScheme ? getSchemeDoc(data) : cloneDeep(data);
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
