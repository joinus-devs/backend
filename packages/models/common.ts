import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class Scheme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
