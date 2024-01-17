import { Column, Entity, ManyToMany } from "typeorm";
import { Club } from "./club";
import { Scheme } from "./common";

export interface UserScheme extends Scheme {
  password: string;
  social_id: string;
  name: string;
  sex: boolean;
  phone: string;
  email: string;
}

export type UserDto = Omit<UserScheme, "password">;

export type UserCreate = Omit<UserScheme, keyof Scheme>;

export type UserUpdate = Partial<
  Pick<UserCreate, "name" | "sex" | "phone" | "email">
>;

@Entity("users")
export class User extends Scheme implements UserScheme {
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

  @ManyToMany(() => Club)
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
