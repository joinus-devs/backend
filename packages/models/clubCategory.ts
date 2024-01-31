import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Category } from "./category";
import { Club } from "./club";
import { TimesEntity } from "./common";

export interface ClubCategoryScheme extends TimesEntity {
  club_id: number;
  category_id: number;
}

@Entity("clubs_categories")
export class ClubCategory extends TimesEntity implements ClubCategoryScheme {
  @PrimaryColumn()
  club_id: number;

  @PrimaryColumn()
  category_id: number;

  @ManyToOne(() => Club, (club) => club.categories, {
    cascade: false,
  })
  @JoinColumn({ name: "club_id" })
  club: Club;

  @ManyToOne(() => Category, (category) => category.clubs, {
    cascade: false,
  })
  @JoinColumn({ name: "category_id" })
  category: Category;
}
