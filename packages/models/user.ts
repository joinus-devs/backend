import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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

export type UserCreate = Omit<UserScheme, "id">;

export type UserUpdate = Partial<
  Pick<UserCreate, "name" | "sex" | "phone" | "email">
>;

@Entity("users")
export class User extends Scheme implements UserScheme {
  @PrimaryGeneratedColumn()
  id: number;

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

  public toDto = (): UserDto => {
    const { password, ...dto } = this;
    return dto;
  };
}
