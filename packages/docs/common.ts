import { Schema } from "swagger-jsdoc";
import { IdEntity } from "../models/common";

export type CoreData<T> = Omit<T, keyof IdEntity>;

export type CoreSchema<T> = {
  [key in keyof CoreData<T>]: Schema[keyof Schema];
};
