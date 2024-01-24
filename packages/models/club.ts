import { Column, Entity, OneToMany } from "typeorm";
import { IdEntity } from "./common";
import { Feed } from "./feed";
import { UserInClub } from "./userInClub";

export interface ClubScheme extends IdEntity {
  name: string;
  description: string;
  capacity: number;
}

export type ClubDto = ClubScheme;

export type ClubWithUsersDto = ClubDto & { users: UserInClub[] };

export type ClubCreate = Omit<ClubScheme, keyof IdEntity>;

export type ClubUpdate = ClubCreate;

@Entity("clubs")
export class Club extends IdEntity implements ClubScheme {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  capacity: number;

  @OneToMany(() => UserInClub, (userInClub) => userInClub.club, {
    cascade: true,
  })
  public users: UserInClub[];

  @OneToMany(() => Feed, (feed) => feed.club)
  public feeds: Feed[];
}

export class ClubConverter {
  public static toDto = (club: Club): ClubDto => {
    const dto = { ...club };
    return dto;
  };

  public static toDtoWithUsers = (club: Club): ClubWithUsersDto => {
    const dto = { ...club };
    return dto;
  };

  public static toEntityFromCreate = (dto: ClubCreate): Club => {
    const club = new Club();
    return Object.assign(club, dto);
  };

  public static toEntityFromUpdate = (id: number, dto: ClubUpdate): Club => {
    const club = new Club();
    return Object.assign(club, { id, ...dto });
  };
}
