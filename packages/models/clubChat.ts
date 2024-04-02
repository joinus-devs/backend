import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Club } from "./club";
import { IdEntity, TimesEntity } from "./common";
import { User, UserDto } from "./user";

export interface ClubChatScheme extends TimesEntity {
  user_id: number;
  club_id: number;
  message: string;
}

export interface ClubChatDto extends ClubChatScheme {
  user: UserDto;
  club: Club;
}

@Entity("clubs_chats")
export class ClubChat extends IdEntity implements ClubChatScheme {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  club_id: number;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.clubs, {
    cascade: false,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Club, (club) => club.users, {
    cascade: false,
  })
  @JoinColumn({ name: "club_id" })
  club: Club;
}

export class ClubChatConverter {
  public static toDto = (clubChat: ClubChat): ClubChatDto => {
    const { password, ...user } = clubChat.user;
    return { ...clubChat, user, club: clubChat.club };
  };
}
