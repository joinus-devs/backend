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
        social_id varchar(255) null,
        type enum('local', 'google', 'kakao', 'naver') not null,
        name varchar(255) not null,
        profile varchar(255),
        sex boolean not null,
        birth date not null,
        phone varchar(255) not null,
        email varchar(255) not null,
        password varchar(255),
        unique (social_id),
        unique (email),
        check((type = 'local' and social_id is null) or (type != 'local' and social_id is not null)),
        check((type = 'local' and password is not null and length(password) >= 8) or (type != 'local' and password is null))
      );
    `);

    await queryRunner.query(`
      create table clubs (
        ${idQuery}
        ${timesQuery}
        name varchar(255) not null,
        description varchar(255) not null,
        capacity int not null,
        sex boolean,
        minimum_age int not null,
        maximum_age int not null,
        unique (name)
      );
    `);

    await queryRunner.query(`
      create table clubs_chats (
        ${idQuery}
        ${timesQuery}
        user_id int not null,
        club_id int not null,
        message text not null,
        foreign key (user_id) references users(id),
        foreign key (club_id) references clubs(id)
      )
    `);

    await queryRunner.query(`
      create table clubs_images (
        ${idQuery}
        ${timesQuery}
        club_id int not null,
        url varchar(255) not null,
        type enum('main', 'sub') not null,
        foreign key (club_id) references clubs(id)
      );
    `);

    await queryRunner.query(`
      create table users_in_clubs (
        ${timesQuery}
        user_id int not null,
        club_id int not null,
        role enum('admin', 'staff', 'member', 'pending', 'banned') not null,
        exp int not null,
        primary key (user_id, club_id),
        foreign key (user_id) references users(id),
        foreign key (club_id) references clubs(id)
      );
    `);

    await queryRunner.query(`
      create table categories (
        ${idQuery}
        ${timesQuery}
        name varchar(255) not null
      );
    `);

    await queryRunner.query(`
      create table clubs_categories (
        ${timesQuery}
        club_id int not null,
        category_id int not null,
        primary key (club_id, category_id),
        foreign key (club_id) references clubs(id),
        foreign key (category_id) references categories(id)
      );
    `);

    await queryRunner.query(`
      create table feeds (
        ${idQuery}
        ${timesQuery}
        user_id int not null,
        club_id int not null,
        title varchar(255) not null,
        content text not null,
        is_private boolean not null,
        foreign key (user_id) references users(id),
        foreign key (club_id) references clubs(id)
      )
    `);

    await queryRunner.query(`
      create table comments (
        ${idQuery}
        ${timesQuery}
        user_id int not null,
        feed_id int not null,
        content text not null,
        foreign key (user_id) references users(id),
        foreign key (feed_id) references feeds(id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table comments;`);
    await queryRunner.query(`drop table feeds;`);
    await queryRunner.query(`drop table clubs_categories;`);
    await queryRunner.query(`drop table categories;`);
    await queryRunner.query(`drop table users_in_clubs;`);
    await queryRunner.query(`drop table clubs_images;`);
    await queryRunner.query(`drop table clubs;`);
    await queryRunner.query(`drop table users;`);
  }
}

export default CreateTables1705433210498;
