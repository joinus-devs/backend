import { Server } from "http";
import { DataSource, Repository } from "typeorm";
import ws from "ws";
import { ClubChat } from "../models";
import { SocketConnection, SocketMember } from "./conn";
import { MessageFromClient, error, success } from "./utils";

class SocketProvider {
  static instance: SocketProvider;
  private _repository: Repository<ClubChat>;
  private _rooms = new Map<number, SocketMember[]>();

  private constructor(dataSource: DataSource, server: Server) {
    this._repository = dataSource.getRepository(ClubChat);

    const wss = new ws.Server({ server });
    wss.on("connection", (ws: SocketConnection) => {
      ws.on("message", (message: string) => {
        const parsedMessage: MessageFromClient = JSON.parse(message);
        const { method, body, room, user } = parsedMessage;
        if (!room || !user) {
          ws.send(error({ body: "Invalid request" }));
          return;
        }
        switch (method) {
          case "join":
            this.join(room, user, ws);
            ws.room = room;
            ws.user = user;
            break;
          case "leave":
            this.leave(room, user, ws);
            break;
          case "broadcast":
            this.broadcast(room, user, body, ws);
            break;
          default:
            ws.send(error({ body: "Invalid method" }));
            return;
        }
      });
      ws.on("error", (error) => {
        console.log(`Socket error: ${error}`);
      });
      ws.on("close", () => {
        if (!ws.room || !ws.user) return;
        this.leave(ws.room, ws.user, ws);
        console.log("Connection closed", ws.user);
      });
    });
  }

  private createRoom = (room: number) => {
    this._rooms.set(room, []);
  };

  private getRoom = (room: number) => {
    return this._rooms.get(room);
  };

  private deleteRoom = (room: number) => {
    this._rooms.delete(room);
  };

  private isMember = (room: number, user: number) => {
    return (
      this._rooms.get(room)?.findIndex((member) => member.user === user) !== -1
    );
  };

  private getMembers = (room: SocketMember[]) => {
    return room.map((member) => member.user);
  };

  private join = (room: number, user: number, conn: SocketConnection) => {
    const myRoom = this.getRoom(room);
    if (myRoom) {
      if (this.isMember(room, user)) {
        conn.send(error({ body: `You are already in room ${room}` }));
        return;
      }
      myRoom.push({ user, conn });
      myRoom.forEach((member) => {
        if (!member.conn.OPEN) return;
        member.conn.send(
          success({
            method: "join",
            body: `Joined room ${room}`,
            user,
            users: this.getMembers(myRoom),
          })
        );
      });
      return { user, conn };
    } else {
      this.createRoom(room);
      this.join(room, user, conn);
    }
  };

  private leave = (room: number, user: number, conn: SocketConnection) => {
    const myRoom = this.getRoom(room);
    if (myRoom) {
      const index = myRoom.findIndex((member) => member.user === user);
      if (index > -1) {
        myRoom.splice(index, 1);
        myRoom.forEach((member) => {
          if (!member.conn.OPEN) return;
          member.conn.send(
            success({
              method: "leave",
              body: `Left room ${room}`,
              user,
              users: this.getMembers(myRoom),
            })
          );
        });
      } else {
        conn.send(error({ body: `You are not in room ${room}` }));
      }

      // If room is empty, delete it.
      if (myRoom.length === 0) {
        this.deleteRoom(room);
      }
    } else {
      conn.send(error({ body: `Room ${room} does not exist` }));
    }
  };

  private saveChat = (room: number, user: number, message: string) => {
    const chat = new ClubChat();
    chat.user_id = user;
    chat.club_id = room;
    chat.message = message;
    this._repository.save(chat);
  };

  private broadcast = (
    room: number,
    user: number,
    message: string,
    conn: ws
  ) => {
    const myRoom = this._rooms.get(room);
    if (myRoom) {
      if (this.isMember(room, user)) {
        myRoom.forEach((member) => {
          if (!member.conn.OPEN) return;
          member.conn.send(
            success({
              method: "broadcast",
              body: message,
              user,
              users: this.getMembers(myRoom),
            })
          );
        });
        this.saveChat(room, user, message);
      } else {
        conn.send(error({ body: "You are not a member of this room" }));
      }
    } else {
      conn.send(error({ body: `Room ${room} does not exist` }));
    }
  };

  static getInstance(dataSource: DataSource, server: Server) {
    if (!SocketProvider.instance) {
      SocketProvider.instance = new SocketProvider(dataSource, server);
    }

    return SocketProvider.instance;
  }
}

export default SocketProvider;
