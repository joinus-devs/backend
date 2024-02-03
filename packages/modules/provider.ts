import { DataSource } from "typeorm";
import { TransactionManager } from ".";
import {
  AuthController,
  CategoryController,
  ClubController,
  CommentController,
  FeedController,
  IAuthController,
  ICategoryController,
  IClubController,
  ICommentController,
  IFeedController,
  IUserController,
  UserController,
} from "../controller";
import { Category, Club, Comment, Feed, User } from "../models";
import {
  AuthService,
  CategoryService,
  ClubService,
  CommentService,
  FeedService,
  IAuthService,
  ICategoryService,
  IClubService,
  ICommentService,
  IFeedService,
  IUserService,
  UserService,
} from "../services";
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
  private _authService: IAuthService;
  private _userService: IUserService;
  private _clubService: IClubService;
  private _feedService: IFeedService;
  private _commentService: ICommentService;
  private _categoryService: ICategoryService;

  constructor(transactionManager: TransactionManager, dataSource: DataSource) {
    this._authService = AuthService.getInstance(
      transactionManager,
      dataSource.getRepository(User)
    );
    this._userService = UserService.getInstance(
      transactionManager,
      dataSource.getRepository(User)
    );
    this._clubService = ClubService.getInstance(
      transactionManager,
      dataSource.getRepository(Club),
      dataSource.getRepository(User),
      dataSource.getRepository(Category)
    );
    this._feedService = FeedService.getInstance(
      transactionManager,
      dataSource.getRepository(Feed),
      dataSource.getRepository(User),
      dataSource.getRepository(Club)
    );
    this._commentService = CommentService.getInstance(
      transactionManager,
      dataSource.getRepository(Comment),
      dataSource.getRepository(Feed),
      dataSource.getRepository(User)
    );
    this._categoryService = CategoryService.getInstance(
      transactionManager,
      dataSource.getRepository(Category)
    );
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
}

class AppController {
  private _authController: IAuthController;
  private _userController: IUserController;
  private _clubController: IClubController;
  private _feedController: IFeedController;
  private _commentController: ICommentController;
  private _categoryController: ICategoryController;

  constructor(appService: AppService) {
    this._authController = AuthController.getInstance(
      appService.authService,
      appService.userService
    );
    this._userController = UserController.getInstance(appService.userService);
    this._clubController = ClubController.getInstance(appService.clubService);
    this._feedController = FeedController.getInstance(appService.feedService);
    this._commentController = CommentController.getInstance(
      appService.commentService
    );
    this._categoryController = CategoryController.getInstance(
      appService.categoryService
    );
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
}

export default AppProvider;
