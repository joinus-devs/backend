import { MigrationInterface, QueryRunner } from "typeorm";

const idQuery = `
  id int not null auto_increment,
  primary key (id),
`;

const timesQuery = `
  created_at datetime(6) not null default current_timestamp(6),
  updated_at datetime(6) not null default current_timestamp(6) on update current_timestamp(6),
  deleted_at datetime(6) null,
`;

class CreateTables1705433210498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table users (
        ${idQuery}
        ${timesQuery}
        social_id varchar(255) not null,
        name varchar(255) not null,
        sex boolean not null,
        phone varchar(255) not null,
        email varchar(255) not null,
        password varchar(255) not null,
        unique (social_id),
        unique (email)
      );
    `);

    await queryRunner.query(`
      create table clubs (
        ${idQuery}
        ${timesQuery}
        name varchar(255) not null,
        description varchar(255) not null,
        capacity int not null,
        unique (name)
      );
    `);

    await queryRunner.query(`
    create table users_in_clubs (
      ${timesQuery}
      user_id int not null,
      club_id int not null,
      primary key (user_id, club_id),
      foreign key (user_id) references users(id),
      foreign key (club_id) references clubs(id)
    );
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table users_in_clubs;`);
    await queryRunner.query(`drop table users;`);
    await queryRunner.query(`drop table clubs;`);
  }
}

export default CreateTables1705433210498;
