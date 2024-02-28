import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Club } from "./club";
import { Comment } from "./comment";
import { IdEntity } from "./common";
import { User, UserDto } from "./user";

export interface FeedScheme extends IdEntity {
  user_id: number;
  club_id: number;
  title: string;
  content: string;
  is_private: boolean;
  comment_count: number;
}

export type FeedDto = FeedScheme & {
  user: UserDto;
};

export type FeedWithClubDto = FeedDto & {
  club: Club;
};

export type FeedCreate = Omit<
  FeedScheme,
  keyof IdEntity | "user_id" | "club_id" | "comment_count"
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

  @Column()
  is_private: boolean;

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

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  public comment_count: number;
}

export class FeedConverter {
  public static toDto = (feed: Feed): FeedDto => {
    const { password, ...user } = feed.user;
    return { ...feed, user };
  };

  public static toWithClubDto = (feed: Feed): FeedWithClubDto => {
    if (feed.club?.categories) {
      (feed.club.categories as any) = feed.club.categories.map(
        (category) => category.category_id
      );
    }
    const { password, ...user } = feed.user;
    return { ...feed, user };
  };

  public static fromCreate = (dto: FeedCreate): Feed => {
    const user = new Feed();
    return Object.assign(user, dto);
  };

  public static fromUpdate = (id: number, dto: FeedUpdate): Feed => {
    const user = new Feed();
    return Object.assign(user, { id, ...dto });
  };
}
