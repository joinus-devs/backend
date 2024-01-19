import { DataSource } from "typeorm";
import { IUserController, UserController } from "./controller";
import { ClubController, IClubController } from "./controller/club";
import { IUserRepository, UserRepository } from "./repositories";
import { ClubRepository, IClubRepository } from "./repositories/club";
import { IUserService, UserService } from "./services";
import { ClubService, IClubService } from "./services/club";
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
  private _clubRepository: IClubRepository;

  constructor(datasource: DataSource) {
    this._userRepository = UserRepository.getInstance(datasource);
    this._clubRepository = ClubRepository.getInstance(datasource);
  }

  get userRepository() {
    return this._userRepository;
  }

  get clubRepository() {
    return this._clubRepository;
  }
}

class AppService {
  private _userService: IUserService;
  private _clubService: IClubService;

  constructor(appRepository: AppRepository) {
    this._userService = UserService.getInstance(appRepository.userRepository);
    this._clubService = ClubService.getInstance(appRepository.clubRepository);
  }

  get userService() {
    return this._userService;
  }

  get clubService() {
    return this._clubService;
  }
}

class AppController {
  private _userController: IUserController;
  private _clubController: IClubController;

  constructor(appService: AppService) {
    this._userController = UserController.getInstance(appService.userService);
    this._clubController = ClubController.getInstance(appService.clubService);
  }

  get userController() {
    return this._userController;
  }

  get clubController() {
    return this._clubController;
  }
}

export default AppManager;
