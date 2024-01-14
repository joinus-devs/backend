import { UserController } from "./controller";
import { Database } from "./database";
import { UserRepository } from "./repositories";
import { UserService } from "./services";
import { Nullable } from "./types";

class AppManager {
  private static _instance: Nullable<AppManager> = null;
  private _database: Database;
  private _appRepository: AppRepository;
  private _appService: AppService;
  private _appController: AppController;

  private constructor(database: Database) {
    this._database = database;
    this._appRepository = this.initRepository();
    this._appService = this.initService();
    this._appController = this.initController();
  }

  static getInstance(database: Database) {
    if (!this._instance) {
      this._instance = new AppManager(database);
    }

    return this._instance;
  }

  private initRepository() {
    return new AppRepository(this._database);
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
  private _userRepository: UserRepository;

  constructor(database: Database) {
    this._userRepository = UserRepository.getInstance(database);
  }

  get userRepository() {
    return this._userRepository;
  }
}

class AppService {
  private _userService: UserService;

  constructor(appRepository: AppRepository) {
    this._userService = UserService.getInstance(appRepository.userRepository);
  }

  get userService() {
    return this._userService;
  }
}

class AppController {
  private _userController: UserController;

  constructor(appService: AppService) {
    this._userController = UserController.getInstance(appService.userService);
  }

  get userController() {
    return this._userController;
  }
}

export default AppManager;
