import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Club } from "./club";
import { Comment, CommentDto } from "./comment";
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
  comments: CommentDto[];
};

export type FeedCreate = Omit<
  FeedScheme,
  keyof IdEntity | "user_id" | "club_id"
>;

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

  @OneToMany(() => Comment, (comment) => comment.feed, {
    cascade: true,
  })
  comments: Comment[];
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
