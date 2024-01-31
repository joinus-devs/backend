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
import { Category, Club, Feed, User } from "../models";
import {
  CategoryRepository,
  CommentRepository,
  ICategoryRepository,
  ICommentRepository,
  IUserRepository,
  UserRepository,
} from "../repositories";
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
  private _appRepository: AppRepository;
  private _appService: AppService;
  private _appController: AppController;

  private constructor(datasource: DataSource) {
    this._datasource = datasource;
    this._transactionManager = this.initTransactionManager();
    this._appRepository = this.initRepository();
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

  private initRepository() {
    return new AppRepository(this._datasource);
  }

  private initService() {
    return new AppService(
      this._appRepository,
      this._transactionManager,
      this._datasource
    );
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
  private _commentRepository: ICommentRepository;
  private _categoryRepository: ICategoryRepository;

  constructor(datasource: DataSource) {
    this._userRepository = UserRepository.getInstance(datasource);
    this._commentRepository = CommentRepository.getInstance(datasource);
    this._categoryRepository = CategoryRepository.getInstance(datasource);
  }

  get userRepository() {
    return this._userRepository;
  }

  get commentRepository() {
    return this._commentRepository;
  }

  get categoryRepository() {
    return this._categoryRepository;
  }
}

class AppService {
  private _authService: IAuthService;
  private _userService: IUserService;
  private _clubService: IClubService;
  private _feedService: IFeedService;
  private _commentService: ICommentService;
  private _categoryService: ICategoryService;

  constructor(
    appRepository: AppRepository,
    transactionManager: TransactionManager,
    dataSource: DataSource
  ) {
    this._authService = AuthService.getInstance(
      transactionManager,
      appRepository.userRepository
    );
    this._userService = UserService.getInstance(
      transactionManager,
      appRepository.userRepository
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
      appRepository.commentRepository,
      dataSource.getRepository(Feed),
      appRepository.userRepository
    );
    this._categoryService = CategoryService.getInstance(
      transactionManager,
      appRepository.categoryRepository
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
