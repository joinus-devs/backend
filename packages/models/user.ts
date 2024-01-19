import { Column, Entity, JoinTable, OneToMany } from "typeorm";
import { Club } from "./club";
import { IdEntity } from "./common";
import { UserInClub } from "./userInClub";

export interface UserScheme extends IdEntity {
  password: string;
  social_id: string;
  name: string;
  sex: boolean;
  phone: string;
  email: string;
}

export type UserDto = Omit<UserScheme, "password">;

export type UserCreate = Omit<UserScheme, keyof IdEntity>;

export type UserUpdate = Partial<
  Pick<UserCreate, "name" | "sex" | "phone" | "email">
>;

@Entity("users")
export class User extends IdEntity implements UserScheme {
  @Column()
  password: string;

  @Column({ unique: true })
  social_id: string;

  @Column()
  name: string;

  @Column()
  sex: boolean;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => UserInClub, (usersInClubs) => usersInClubs.club)
  @JoinTable({ name: "club" })
  clubs: Club[];
}

export class UserConverter {
  public static toDto = (user: User): UserDto => {
    const { password, ...dto } = user;
    return dto;
  };

  public static toEntityFromCreate = (dto: UserCreate): User => {
    const user = new User();
    return Object.assign(user, dto);
  };

  public static toEntityFromUpdate = (id: number, dto: UserUpdate): User => {
    const user = new User();
    return Object.assign(user, { id, ...dto });
  };
}
