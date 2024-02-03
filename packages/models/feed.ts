import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Club } from "./club";
import { IdEntity } from "./common";
import { User, UserDto } from "./user";

export interface FeedScheme extends IdEntity {
  user_id: number;
  club_id: number;
  title: string;
  content: string;
}

export type FeedDto = FeedScheme & {
  user: UserDto;
};

export type FeedCreate = Omit<FeedScheme, keyof IdEntity>;

export type FeedUpdate = FeedCreate;

@Entity("feeds")
export class Feed extends IdEntity implements FeedScheme {
  @Column()
  user_id: number;

  @Column()
  club_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.feeds, {
    cascade: false,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Club, (club) => club.feeds, {
    cascade: false,
  })
  @JoinColumn({ name: "club_id" })
  club: Club;
}

export class FeedConverter {
  public static toDto = (feed: Feed): FeedDto => {
    const { password, ...user } = feed.user;
    return { ...feed, user };
  };

  public static toEntityFromCreate = (dto: FeedCreate): Feed => {
    const user = new Feed();
    return Object.assign(user, dto);
  };

  public static toEntityFromUpdate = (id: number, dto: FeedUpdate): Feed => {
    const user = new Feed();
    return Object.assign(user, { id, ...dto });
  };
}
