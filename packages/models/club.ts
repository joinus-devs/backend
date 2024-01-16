import { Column, Entity, ManyToMany } from "typeorm";
import { Scheme } from "./common";
import { User } from "./user";

export interface ClubScheme extends Scheme {
  name: string;
  description: string;
  capacity: number;
}

export type ClubDto = ClubScheme;

export type ClubCreate = Omit<ClubScheme, keyof Scheme>;

export type ClubUpdate = ClubCreate;

@Entity("clubs")
export class Club extends Scheme implements ClubScheme {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  capacity: number;

  @ManyToMany(() => User)
  users: User[];

  public toDto = (): ClubDto => {
    return { ...this };
  };
}
