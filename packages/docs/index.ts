import swaggerJSDoc from "swagger-jsdoc";
import {
  signinParmasDoc,
  signinSocialParamsDoc,
  signupParamsDoc,
  signupSocialParamsDoc,
  singinResponseDoc,
} from "./auth";
import {
  categoryCreateDoc,
  categoryDoc,
  categoryDtoDoc,
  categoryUpdateDoc,
} from "./category";
import {
  clubCreateDoc,
  clubDoc,
  clubDtoDoc,
  clubUpdateDoc,
  clubWithUserInfoDoc,
  roleQueryParamsDoc,
  userSetRoleDoc,
} from "./club";
import { commentCreateDoc, commentDtoDoc, commentUpdateDoc } from "./comment";
import {
  cursorParamDoc,
  errorResponse,
  limnitParamDoc,
  makeArray,
  makeBody,
  makeCursor,
  makeScheme,
  makeSuccess,
  scheme,
  successResponse,
} from "./common";
import {
  feedCreateDoc,
  feedDoc,
  feedDtoDoc,
  feedUpdateDoc,
  feedWithClubDtoDoc,
} from "./feed";
import { uploadParamsDoc } from "./storage";
import { userDoc, userDtoDoc, userInClubDtoDoc, userUpdateDoc } from "./user";

class Docs {
  private static _instance: Docs;
  private _swaggerDocs: swaggerJSDoc.OAS3Definition;

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
          scheme: scheme,
          successResponse: successResponse,
          errorResponse: errorResponse,
          user: makeScheme(userDoc),
          club: makeScheme(clubDoc),
          category: makeScheme(categoryDoc),
          feed: makeScheme(feedDoc),
        },
        parameters: {
          cursorParam: { ...cursorParamDoc },
          limitParam: { ...limnitParamDoc },
          signinParams: makeBody(signinParmasDoc),
          signupParams: makeBody(signupParamsDoc),
          signinSocialParams: makeBody(signinSocialParamsDoc),
          signupSocialParams: makeBody(signupSocialParamsDoc),
          userUpdate: makeBody(userUpdateDoc),
          clubCreate: makeBody(clubCreateDoc),
          clubUpdate: makeBody(clubUpdateDoc),
          userSetRole: makeBody(userSetRoleDoc),
          roleQueryParams: { ...roleQueryParamsDoc },
          categoryCreate: makeBody(categoryCreateDoc),
          categoryUpdate: makeBody(categoryUpdateDoc),
          feedCreate: makeBody(feedCreateDoc),
          feedUpdate: makeBody(feedUpdateDoc),
          commentCreate: makeBody(commentCreateDoc),
          commentUpdate: makeBody(commentUpdateDoc),
        },
        responses: {
          signinResponse: makeSuccess(singinResponseDoc),
          userResponse: makeSuccess(makeScheme(userDtoDoc)),
          userInClubResponse: makeSuccess(makeCursor(userInClubDtoDoc)),
          usersResponse: makeSuccess(makeCursor(userDtoDoc)),
          clubResponse: makeSuccess(makeScheme(clubDtoDoc)),
          clubsResponse: makeSuccess(makeCursor(clubDtoDoc)),
          clubsWithUserInfoResponse: makeSuccess(
            makeCursor(clubWithUserInfoDoc)
          ),
          categoryResponse: makeSuccess(makeScheme(categoryDtoDoc)),
          categoriesResponse: makeSuccess(makeArray(categoryDtoDoc)),
          feedResponse: makeSuccess(makeScheme(feedDtoDoc)),
          feedsResponse: makeSuccess(makeCursor(feedDtoDoc)),
          feedsWithClubResponse: makeSuccess(makeCursor(feedWithClubDtoDoc)),
          commentResponse: makeSuccess(makeScheme(commentDtoDoc)),
          commentsResponse: makeSuccess(makeCursor(commentDtoDoc)),
          numberResponse: makeSuccess({
            type: "number",
            example: 1,
          }),
          stringResponse: makeSuccess({
            type: "string",
            example: "string",
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

  public add = (docs: swaggerJSDoc.Paths) => {
    this._swaggerDocs.paths = { ...this._swaggerDocs.paths, ...docs };
  };

  public get = () => {
    return this._swaggerDocs;
  };
}

export default Docs;
