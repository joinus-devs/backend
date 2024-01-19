import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Club } from "./club";
import { TimesEntity } from "./common";
import { User } from "./user";

export interface UserScheme extends TimesEntity {
  user_id: number;
  club_id: number;
}

// export type UserDto = Omit<UserScheme, "password">;

// export type UserCreate = Omit<UserScheme, keyof Scheme>;

// export type UserUpdate = Partial<
//   Pick<UserCreate, "name" | "sex" | "phone" | "email">
// >;

@Entity("users_in_clubs")
export class UserInClub extends TimesEntity implements UserScheme {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  club_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Club, (club) => club.id)
  @JoinColumn({ name: "club_id" })
  club: User;
}

// export class UserConverter {
//   public static toDto = (user: UsersInClubs): UserDto => {
//     const { password, ...dto } = user;
//     return dto;
//   };

//   public static toEntityFromCreate = (dto: UserCreate): UsersInClubs => {
//     const user = new UsersInClubs();
//     return Object.assign(user, dto);
//   };

//   public static toEntityFromUpdate = (id: number, dto: UserUpdate): UsersInClubs => {
//     const user = new UsersInClubs();
//     return Object.assign(user, { id, ...dto });
//   };
// }
