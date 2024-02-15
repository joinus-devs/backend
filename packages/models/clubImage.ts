import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Club } from "./club";
import { IdEntity } from "./common";

export interface ClubImageScheme extends IdEntity {
  club_id: number;
}

@Entity("clubs_images")
export class ClubImage extends IdEntity implements ClubImageScheme {
  @Column()
  club_id: number;

  @Column()
  url: string;

  @Column({
    type: "enum",
    enum: ["main", "sub"],
  })
  type: "main" | "sub";

  @ManyToOne(() => Club, (club) => club.images, {
    cascade: false,
  })
  @JoinColumn({ name: "club_id" })
  club: Club;
}
