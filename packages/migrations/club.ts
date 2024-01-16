import { MigrationInterface, QueryRunner } from "typeorm";

class CreateClubTable1705433210498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table clubs (
        id int not null auto_increment,
        name varchar(255) not null,
        description varchar(255) not null,
        capacity int not null,
        created_at timestamp not null default current_timestamp,
        updated_at timestamp not null default current_timestamp on update current_timestamp,
        deleted_at timestamp null,
        primary key (id),
        unique (name)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table clubs;`);
  }
}

export default CreateClubTable1705433210498;
