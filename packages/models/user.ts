import { Column, Entity, ManyToMany } from "typeorm";
import { Scheme } from "./common";
import { Club } from "./club";

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

  @Column()
  social_id: string;

  @Column()
  name: string;

  @Column()
  sex: boolean;

  @Column()
  phone: string;

  @Column()
  email: string;

  @ManyToMany(() => Club)
  clubs: Club[];

  public toDto = (): UserDto => {
    const { password, ...dto } = this;
    return dto;
  };
}
