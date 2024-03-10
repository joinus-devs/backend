import { DataSource, Repository } from "typeorm";
import Errors from "../constants/errors";
import {
  Category,
  CategoryConverter,
  CategoryCreate,
  CategoryDto,
  CategoryUpdate,
} from "../models";
import { TransactionManager } from "../modules";
import { Nullable } from "../types";

export interface ICategoryService {
  find(id: number): Promise<Nullable<CategoryDto>>;
  findAll(): Promise<CategoryDto[]>;
  create(commentCreate: CategoryCreate): Promise<number>;
  update(id: number, commentUpdate: CategoryUpdate): Promise<number>;
  delete(id: number): Promise<number>;
}

export class CategoryService implements ICategoryService {
  private static _instance: Nullable<CategoryService> = null;
  private _transactionManager: TransactionManager;
  private _categoryRepository: Repository<Category>;

  private constructor(
    dataSoruce: DataSource,
    transactionManager: TransactionManager
  ) {
    this._transactionManager = transactionManager;
    this._categoryRepository = dataSoruce.getRepository(Category);
  }

  static getInstance(
    dataSoruce: DataSource,
    transactionManager: TransactionManager
  ) {
    if (!this._instance) {
      this._instance = new CategoryService(dataSoruce, transactionManager);
    }

    return this._instance;
  }

  find = async (id: number) => {
    let category;
    try {
      category = await this._categoryRepository.findOne({
        where: { id, deleted_at: undefined },
      });
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }

    // 카테고리가 없을 경우
    if (!category) {
      throw Errors.CategoryNotFound.clone();
    }

    return CategoryConverter.toDto(category);
  };

  findAll = async () => {
    try {
      const categories = await this._categoryRepository.find({
        where: { deleted_at: undefined },
      });
      return categories.map((category) => CategoryConverter.toDto(category));
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };

  create = async (categoryCreate: CategoryCreate) => {
    const category = await this._categoryRepository.findOne({
      where: { name: categoryCreate.name, deleted_at: undefined },
    });
    if (category) {
      throw Errors.CategoryNameAlreadyExists.clone();
    }

    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const category = CategoryConverter.fromCreate(categoryCreate);
        const result = await manager.getRepository(Category).save(category);
        return result.id;
      });
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };

  update = async (id: number, categoryUpdate: CategoryUpdate) => {
    try {
      const result = await this._categoryRepository.save(
        CategoryConverter.fromUpdate(id, categoryUpdate)
      );
      return result.id;
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };

  delete = async (id: number) => {
    try {
      await this._categoryRepository.delete(id);
      return id;
    } catch (err) {
      throw Errors.makeInternalServerError(err);
    }
  };
}
