import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Club } from "./club";
import { TimesEntity } from "./common";
import { User } from "./user";

export interface UserInClubScheme extends TimesEntity {
  user_id: number;
  club_id: number;
}

export enum Role {
  Admin = "admin",
  Staff = "staff",
  Member = "member",
  Pending = "pending",
  Banned = "banned",
}

@Entity("users_in_clubs")
export class UserInClub extends TimesEntity implements UserInClubScheme {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  club_id: number;

  @Column()
  role: Role = Role.Pending;

  @Column()
  exp: number = 0;

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
