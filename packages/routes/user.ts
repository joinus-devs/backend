import Router from "express";
import AppManager from "../app";
import { Nullable } from "../types";

class UserRouter {
  private static _instance: Nullable<UserRouter> = null;
  private _appManager: AppManager;

  private constructor(appManager: AppManager) {
    this._appManager = appManager;
  }

  static getInstance(appManager: AppManager) {
    if (!this._instance) {
      this._instance = new UserRouter(appManager);
    }

    return this._instance;
  }

  initRouter = () => {
    const router = Router();
    const userController = this._appManager.appController.userController;

    router.route("").get(userController.getUsers);

    return router;
  };
}

export default UserRouter;
