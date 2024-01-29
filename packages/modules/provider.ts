import { DataSource } from "typeorm";
import { TransactionManager } from ".";
import {
  AuthController,
  ClubController,
  CommentController,
  FeedController,
  IAuthController,
  IClubController,
  ICommentController,
  IFeedController,
  IUserController,
  UserController,
} from "../controller";
import {
  ClubRepository,
  CommentRepository,
  FeedRepository,
  IClubRepository,
  ICommentRepository,
  IFeedRepository,
  IUserRepository,
  UserRepository,
} from "../repositories";
import {
  AuthService,
  ClubService,
  CommentService,
  FeedService,
  IAuthService,
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
    return new AppService(this._appRepository, this._transactionManager);
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
  private _feedRepository: IFeedRepository;
  private _commentRepository: ICommentRepository;

  constructor(datasource: DataSource) {
    this._userRepository = UserRepository.getInstance(datasource);
    this._clubRepository = ClubRepository.getInstance(datasource);
    this._feedRepository = FeedRepository.getInstance(datasource);
    this._commentRepository = CommentRepository.getInstance(datasource);
  }

  get userRepository() {
    return this._userRepository;
  }

  get clubRepository() {
    return this._clubRepository;
  }

  get feedRepository() {
    return this._feedRepository;
  }

  get commentRepository() {
    return this._commentRepository;
  }
}

class AppService {
  private _authService: IAuthService;
  private _userService: IUserService;
  private _clubService: IClubService;
  private _feedService: IFeedService;
  private _commentService: ICommentService;

  constructor(
    appRepository: AppRepository,
    transactionManager: TransactionManager
  ) {
    this._authService = AuthService.getInstance(appRepository.userRepository);
    this._userService = UserService.getInstance(appRepository.userRepository);
    this._clubService = ClubService.getInstance(
      transactionManager,
      appRepository.clubRepository,
      appRepository.userRepository
    );
    this._feedService = FeedService.getInstance(
      transactionManager,
      appRepository.feedRepository,
      appRepository.userRepository,
      appRepository.clubRepository
    );
    this._commentService = CommentService.getInstance(
      transactionManager,
      appRepository.commentRepository,
      appRepository.feedRepository,
      appRepository.userRepository
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
}

class AppController {
  private _authController: IAuthController;
  private _userController: IUserController;
  private _clubController: IClubController;
  private _feedController: IFeedController;
  private _commentController: ICommentController;

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
}

export default AppProvider;
