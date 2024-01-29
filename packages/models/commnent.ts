import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Club } from "./club";
import { IdEntity } from "./common";
import { Feed, FeedDto } from "./feed";
import { User, UserDto } from "./user";

export interface CommentScheme extends IdEntity {
  user_id: number;
  feed_id: number;
}

export type CommentDto = CommentScheme & {
  user: UserDto;
  feed: FeedDto;
};

export type CommentCreate = Omit<CommentScheme, keyof IdEntity>;

export type CommentUpdate = CommentCreate;

@Entity("comments")
export class Comment extends IdEntity implements CommentScheme {
  @Column()
  user_id: number;

  @Column()
  feed_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Club, (club) => club.feeds, {
    cascade: false,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => User, (user) => user.feeds, {
    cascade: false,
  })
  @JoinColumn({ name: "feed_id" })
  feed: Feed;
}

export class CommentConverter {
  public static toDto = (comment: Comment): CommentDto => {
    const { password, ...user } = comment.user;
    const { ...feed } = comment.feed;
    return { ...comment, user, feed };
  };

  public static toEntityFromCreate = (dto: CommentCreate): Comment => {
    const user = new Comment();
    return Object.assign(user, dto);
  };

  public static toEntityFromUpdate = (
    id: number,
    dto: CommentUpdate
  ): Comment => {
    const user = new Comment();
    return Object.assign(user, { id, ...dto });
  };
}
