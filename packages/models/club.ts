import { Column, Entity, OneToMany } from "typeorm";
import { ClubCategory } from "./clubCategory";
import { IdEntity } from "./common";
import { Feed } from "./feed";
import { UserInClub } from "./userInClub";

export interface ClubScheme extends IdEntity {
  name: string;
  description: string;
  capacity: number;
  sex: boolean;
  minimum_age: number;
  maximum_age: number;
}

export type ClubDto = ClubScheme & {
  categories: number[];
};

export type ClubWithUserInfoDto = ClubDto & { user: UserInClub };

export type ClubWithUsersDto = ClubDto & { users: UserInClub[] };

export type ClubCreate = Omit<ClubScheme, keyof IdEntity> & {
  categories: number[];
};

export type ClubUpdate = ClubCreate;

@Entity("clubs")
export class Club extends IdEntity implements ClubScheme {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  capacity: number;

  @Column()
  sex: boolean;

  @Column()
  minimum_age: number;

  @Column()
  maximum_age: number;

  @OneToMany(() => UserInClub, (userInClub) => userInClub.club, {
    cascade: true,
  })
  public users: UserInClub[];

  @OneToMany(() => Feed, (feed) => feed.club, {
    cascade: true,
  })
  public feeds: Feed[];

  @OneToMany(() => ClubCategory, (clubCategory) => clubCategory.club, {
    cascade: true,
  })
  public categories: ClubCategory[];
}

export class ClubConverter {
  public static toDto = (club: Club): ClubDto => {
    const dto = {
      ...club,
      categories: club.categories.map((c) => c.category_id),
    };
    return dto;
  };

  public static toDtoWithUserInfo = (club: Club): ClubWithUserInfoDto => {
    const { users, ...clubWithoutUsers } = club;
    const userInfo = users?.[0];
    const dto = {
      ...clubWithoutUsers,
      categories: club.categories.map((c) => c.category_id),
      user: userInfo,
    };
    return dto;
  };

  public static toDtoWithUsers = (club: Club): ClubWithUsersDto => {
    const dto = {
      ...club,
      categories: club.categories.map((c) => c.category_id),
    };
    return dto;
  };

  public static fromCreate = (dto: ClubCreate): Club => {
    const club = new Club();
    return Object.assign(club, dto);
  };

  public static fromUpdate = (id: number, dto: ClubUpdate): Club => {
    const club = new Club();
    return Object.assign(club, { id, ...dto });
  };
}
