import { Repository } from "typeorm";
import {
  Category,
  CategoryConverter,
  CategoryCreate,
  CategoryDto,
  CategoryUpdate,
} from "../models";
import { TransactionManager } from "../modules";
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
  private _categoryRepository: Repository<Category>;

  private constructor(
    transactionManager: TransactionManager,
    categoryRepository: Repository<Category>
  ) {
    this._transactionManager = transactionManager;
    this._categoryRepository = categoryRepository;
  }

  static getInstance(
    transactionManager: TransactionManager,
    categoryRepository: Repository<Category>
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
      category = await this._categoryRepository.findOne({
        where: { id, deleted_at: undefined },
      });
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
      const categories = await this._categoryRepository.find({
        where: { deleted_at: undefined },
      });
      return categories.map((category) => CategoryConverter.toDto(category));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (categoryCreate: CategoryCreate) => {
    try {
      return this._transactionManager.withTransaction(async (manager) => {
        const category = CategoryConverter.toEntityFromCreate(categoryCreate);
        const result = await manager.getRepository(Category).save(category);
        return result.id;
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
      const result = await this._categoryRepository.save(
        CategoryConverter.toEntityFromUpdate(id, categoryUpdate)
      );
      return result.id;
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      await this._categoryRepository.delete(id);
      return id;
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
