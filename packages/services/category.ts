import {
  CategoryConverter,
  CategoryCreate,
  CategoryDto,
  CategoryUpdate,
} from "../models";
import { TransactionManager } from "../modules";
import { ICategoryRepository } from "../repositories";
import { ErrorResponse, Nullable } from "../types";

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
  private _categoryRepository: ICategoryRepository;

  private constructor(
    transactionManager: TransactionManager,
    categoryRepository: ICategoryRepository
  ) {
    this._transactionManager = transactionManager;
    this._categoryRepository = categoryRepository;
  }

  static getInstance(
    transactionManager: TransactionManager,
    categoryRepository: ICategoryRepository
  ) {
    if (!this._instance) {
      this._instance = new CategoryService(
        transactionManager,
        categoryRepository
      );
    }

    return this._instance;
  }

  find = async (id: number) => {
    let category;
    try {
      category = await this._categoryRepository.find(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }

    // check if comment exists
    if (!category) {
      throw new ErrorResponse(404, "Category not found");
    }

    return CategoryConverter.toDto(category);
  };

  findAll = async () => {
    try {
      const categories = await this._categoryRepository.findAll();
      return categories.map((category) => CategoryConverter.toDto(category));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (categoryCreate: CategoryCreate) => {
    try {
      return this._transactionManager.withTransaction(async () => {
        const category = CategoryConverter.toEntityFromCreate(categoryCreate);
        return await this._categoryRepository.create(category);
      });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, categoryUpdate: CategoryUpdate) => {
    try {
      return await this._categoryRepository.update(
        CategoryConverter.toEntityFromUpdate(id, categoryUpdate)
      );
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      return await this._categoryRepository.delete(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
