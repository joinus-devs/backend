import { Column, Entity, OneToMany } from "typeorm";
import { ClubCategory } from "./clubCategory";
import { IdEntity } from "./common";

export interface CategoryScheme extends IdEntity {
  name: string;
}

export type CategoryDto = CategoryScheme;

export type CategoryCreate = Omit<CategoryScheme, keyof IdEntity>;

export type CategoryUpdate = CategoryCreate;

@Entity("categories")
export class Category extends IdEntity implements CategoryScheme {
  @Column()
  name: string;

  @OneToMany(() => ClubCategory, (clubCategory) => clubCategory.category, {
    cascade: true,
  })
  public clubs: ClubCategory[];
}

export class CategoryConverter {
  public static toDto = (category: Category): CategoryDto => {
    const { ...dto } = category;
    return dto;
  };

  public static fromCreate = (dto: CategoryCreate): Category => {
    const category = new Category();
    return Object.assign(category, dto);
  };

  public static fromUpdate = (id: number, dto: CategoryUpdate): Category => {
    const category = new Category();
    return Object.assign(category, { id, ...dto });
  };
}
