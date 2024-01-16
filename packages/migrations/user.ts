import { MigrationInterface, QueryRunner } from "typeorm";

class CreateUsersTable1705424568911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table users (
        id int not null auto_increment,
        social_id varchar(255) not null,
        name varchar(255) not null,
        sex boolean not null,
        phone varchar(255) not null,
        email varchar(255) not null,
        password varchar(255) not null,
        created_at timestamp not null default current_timestamp,
        updated_at timestamp not null default current_timestamp on update current_timestamp,
        primary key (id),
        unique (social_id),
        unique (email)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table users;`);
  }
}

export default CreateUsersTable1705424568911;
