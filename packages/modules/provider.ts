import { DataSource } from "typeorm";
import { TransactionManager } from ".";
import {
  AuthController,
  CategoryController,
  ClubChatController,
  ClubController,
  CommentController,
  FeedController,
  IAuthController,
  ICategoryController,
  IClubChatController,
  IClubController,
  ICommentController,
  IFeedController,
  IUserController,
  UserController,
} from "../controller";
import { IStorageController, StorageController } from "../controller/storage";
import {
  AuthService,
  CategoryService,
  ClubChatService,
  ClubService,
  CommentService,
  FeedService,
  IAuthService,
  ICategoryService,
  IClubChatService,
  IClubService,
  ICommentService,
  IFeedService,
  IUserService,
  UserService,
} from "../services";
import { IStorageService, StorageService } from "../services/storage";
import { Nullable } from "../types";

class AppProvider {
  private static _instance: Nullable<AppProvider> = null;
  private _datasource: DataSource;
  private _transactionManager: TransactionManager;
  private _appService: AppService;
  private _appController: AppController;

  private constructor(datasource: DataSource) {
    this._datasource = datasource;
    this._transactionManager = this.initTransactionManager();
    this._appService = this.initService();
    this._appController = this.initController();
  }

  static getInstance(database: DataSource) {
    if (!this._instance) {
      this._instance = new AppProvider(database);
    }

    return this._instance;
  }

  private initTransactionManager() {
    return new TransactionManager(this._datasource);
  }

  private initService() {
    return new AppService(this._transactionManager, this._datasource);
  }

  private initController() {
    return new AppController(this._appService);
  }

  get appController() {
    return this._appController;
  }
}

class AppService {
  private _storageService: IStorageService;
  private _authService: IAuthService;
  private _userService: IUserService;
  private _clubService: IClubService;
  private _feedService: IFeedService;
  private _commentService: ICommentService;
  private _categoryService: ICategoryService;
  private _clubChatService: IClubChatService;

  constructor(transactionManager: TransactionManager, dataSource: DataSource) {
    this._storageService = StorageService.getInstance();
    this._authService = AuthService.getInstance(dataSource, transactionManager);
    this._userService = UserService.getInstance(dataSource, transactionManager);
    this._clubService = ClubService.getInstance(dataSource, transactionManager);
    this._feedService = FeedService.getInstance(dataSource, transactionManager);
    this._commentService = CommentService.getInstance(
      dataSource,
      transactionManager
    );
    this._categoryService = CategoryService.getInstance(
      dataSource,
      transactionManager
    );
    this._clubChatService = ClubChatService.getInstance(
      dataSource,
      transactionManager
    );
  }

  get storageService() {
    return this._storageService;
  }

  get authService() {
    return this._authService;
  }

  get userService() {
    return this._userService;
  }

  get clubService() {
    return this._clubService;
  }

  get feedService() {
    return this._feedService;
  }

  get commentService() {
    return this._commentService;
  }

  get categoryService() {
    return this._categoryService;
  }

  get clubChatService() {
    return this._clubChatService;
  }
}

class AppController {
  private _storageController: IStorageController;
  private _authController: IAuthController;
  private _userController: IUserController;
  private _clubController: IClubController;
  private _feedController: IFeedController;
  private _commentController: ICommentController;
  private _categoryController: ICategoryController;
  private _clubChatController: IClubChatController;

  constructor(appService: AppService) {
    this._storageController = StorageController.getInstance(
      appService.storageService
    );
    this._authController = AuthController.getInstance(appService.authService);
    this._userController = UserController.getInstance(appService.userService);
    this._clubController = ClubController.getInstance(appService.clubService);
    this._feedController = FeedController.getInstance(appService.feedService);
    this._commentController = CommentController.getInstance(
      appService.commentService
    );
    this._categoryController = CategoryController.getInstance(
      appService.categoryService
    );
    this._clubChatController = ClubChatController.getInstance(
      appService.clubChatService
    );
  }

  get storageController() {
    return this._storageController;
  }

  get authController() {
    return this._authController;
  }

  get userController() {
    return this._userController;
  }

  get clubController() {
    return this._clubController;
  }

  get feedController() {
    return this._feedController;
  }

  get commentController() {
    return this._commentController;
  }

  get categoryController() {
    return this._categoryController;
  }

  get clubChatController() {
    return this._clubChatController;
  }
}

export default AppProvider;
