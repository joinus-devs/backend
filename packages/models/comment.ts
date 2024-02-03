import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IdEntity } from "./common";
import { Feed } from "./feed";
import { User, UserDto } from "./user";

export interface CommentScheme extends IdEntity {
  user_id: number;
  feed_id: number;
  content: string;
}

export type CommentDto = CommentScheme & {
  user: UserDto;
};

export type CommentCreate = Omit<
  CommentScheme,
  keyof IdEntity | "user_id" | "feed_id"
>;

export type CommentUpdate = CommentCreate;

@Entity("comments")
export class Comment extends IdEntity implements CommentScheme {
  @Column()
  user_id: number;

  @Column()
  feed_id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments, {
    cascade: false,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Feed, (feed) => feed.comments, {
    cascade: false,
  })
  @JoinColumn({ name: "feed_id" })
  feed: Feed;
}

export class CommentConverter {
  public static toDto = (comment: Comment): CommentDto => {
    const { password, ...user } = comment.user;
    return { ...comment, user };
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
