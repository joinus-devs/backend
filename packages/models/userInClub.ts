import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Club } from "./club";
import { TimesEntity } from "./common";
import { User } from "./user";

export interface UserInClubScheme extends TimesEntity {
  user_id: number;
  club_id: number;
}

@Entity("users_in_clubs")
export class UserInClub extends TimesEntity implements UserInClubScheme {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  club_id: number;

  @ManyToOne(() => User, (user) => user.clubs, {
    cascade: false,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Club, (club) => club.users, {
    cascade: false,
  })
  @JoinColumn({ name: "club_id" })
  club: Club;
}
