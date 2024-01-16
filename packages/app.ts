import { DataSource } from "typeorm";
import { IUserController, UserController } from "./controller";
import { IUserRepository, UserRepository } from "./repositories";
import { IUserService, UserService } from "./services";
import { Nullable } from "./types";

class AppManager {
  private static _instance: Nullable<AppManager> = null;
  private _datasource: DataSource;
  private _appRepository: AppRepository;
  private _appService: AppService;
  private _appController: AppController;

  private constructor(datasource: DataSource) {
    this._datasource = datasource;
    this._appRepository = this.initRepository();
    this._appService = this.initService();
    this._appController = this.initController();
  }

  static getInstance(database: DataSource) {
    if (!this._instance) {
      this._instance = new AppManager(database);
    }

    return this._instance;
  }

  private initRepository() {
    return new AppRepository(this._datasource);
  }

  private initService() {
    return new AppService(this._appRepository);
  }

  private initController() {
    return new AppController(this._appService);
  }

  get appController() {
    return this._appController;
  }
}

class AppRepository {
  private _userRepository: IUserRepository;

  constructor(datasource: DataSource) {
    this._userRepository = UserRepository.getInstance(datasource);
  }

  get userRepository() {
    return this._userRepository;
  }
}

class AppService {
  private _userService: IUserService;

  constructor(appRepository: AppRepository) {
    this._userService = UserService.getInstance(appRepository.userRepository);
  }

  get userService() {
    return this._userService;
  }
}

class AppController {
  private _userController: IUserController;

  constructor(appService: AppService) {
    this._userController = UserController.getInstance(appService.userService);
  }

  get userController() {
    return this._userController;
  }
}

export default AppManager;
