import { Server } from "http";
import { DataSource, Repository } from "typeorm";
import ws from "ws";
import { ClubChat } from "../models";

interface MessageFromClient {
  method: "join" | "leave" | "broadcast";
  body: string;
  room: number;
  user: number;
}

interface MessageToClient<T extends "success" | "error"> {
  method: T extends "success" ? "join" | "leave" | "broadcast" : null;
  status: T;
  body: string;
  user?: number;
  users?: number[];
}

const makeMessage = <T extends "success" | "error">({
  status,
  method,
  body,
  user,
  users,
}: MessageToClient<T>): string => {
  return JSON.stringify({ status, method, body, user, users });
};

class SocketProvider {
  static instance: SocketProvider;
  static rooms: Map<number, ws[]> = new Map();
  static roomMembers = new Map<number, number[]>();
  private _repository: Repository<ClubChat>;

  private constructor(dataSource: DataSource, server: Server) {
    this._repository = dataSource.getRepository(ClubChat);

    const wss = new ws.Server({ server });
    wss.on("connection", (ws, req) => {
      const ip = req.headers["x-forwarded-for"];
      console.log(`New connection from ${ip}`);
      ws.on("message", (message: string) => {
        const parsedMessage: MessageFromClient = JSON.parse(message);
        const { method, body, room, user } = parsedMessage;
        switch (method) {
          case "join":
            if (!room) {
              ws.send(
                makeMessage({
                  status: "error",
                  method: null,
                  body: "Room is required",
                })
              );
              return;
            }
            this.joinRoom(room, ws);
            this.addMember(room, user, ws);
            break;
          case "leave":
            if (!room) {
              ws.send(
                makeMessage({
                  status: "error",
                  method: null,
                  body: "Room is required",
                })
              );
              return;
            }
            this.removeMember(room, user, ws);
            this.leaveRoom(room, ws);
            break;
          case "broadcast":
            if (!room) {
              ws.send(
                makeMessage({
                  status: "error",
                  method: null,
                  body: "Room is required",
                })
              );
              return;
            }
            this.broadcast(room, user, body, ws);
            break;
          default:
            ws.send(
              makeMessage({
                status: "error",
                method: null,
                body: "Invalid method",
              })
            );
            return;
        }

        console.log(`Received message => ${parsedMessage}`);
      });
      ws.on("error", (error) => {
        console.log(`Error => ${error}`);
      });
      ws.on("close", () => {
        console.log("Connection closed");
      });
    });
  }

  public joinRoom(room: number, ws: ws) {
    if (SocketProvider.rooms.has(room)) {
      SocketProvider.rooms.get(room)!.push(ws);
    } else {
      SocketProvider.rooms.set(room, [ws]);
    }
  }

  public addMember = (room: number, user: number, ws: ws) => {
    if (SocketProvider.roomMembers.has(room)) {
      SocketProvider.roomMembers.get(room)!.push(user);
      ws.send(
        makeMessage({
          status: "success",
          method: "join",
          body: `Added member ${user} to room ${room}`,
          users: SocketProvider.roomMembers.get(room),
        })
      );
    } else {
      SocketProvider.roomMembers.set(room, [user]);
      ws.send(
        makeMessage({
          status: "success",
          method: "join",
          body: `Added member ${user} to new room ${room}`,
          users: SocketProvider.roomMembers.get(room),
        })
      );
    }
  };

  public leaveRoom = (room: number, ws: ws) => {
    if (SocketProvider.rooms.has(room)) {
      const index = SocketProvider.rooms.get(room)!.indexOf(ws);
      if (index > -1) {
        SocketProvider.rooms.get(room)!.splice(index, 1);
      } else {
        // ws.send(makeMessage({status:"error", method:null, body: `You are not in room ${room}`}));
      }

      // If room is empty, delete it.
      if (SocketProvider.rooms.get(room)!.length === 0) {
        SocketProvider.rooms.delete(room);
      }
    } else {
      // ws.send(makeMessage({status:"error", method:null, body:`Room ${room} does not exist`}));
    }
  };

  public removeMember = (room: number, user: number, ws: ws) => {
    if (SocketProvider.roomMembers.has(room)) {
      const index = SocketProvider.roomMembers.get(room)!.indexOf(user);
      if (index > -1) {
        SocketProvider.roomMembers.get(room)!.splice(index, 1);
        ws.send(
          makeMessage({
            status: "success",
            method: "leave",
            body: `Member ${user} removed from room ${room}`,
            users: SocketProvider.roomMembers.get(room),
          })
        );
      } else {
        ws.send(
          makeMessage({
            status: "error",
            method: null,
            body: `Member ${user} is not in room ${room}`,
          })
        );
      }

      if (SocketProvider.roomMembers.get(room)!.length === 0) {
        SocketProvider.roomMembers.delete(room);
      }
    } else {
      ws.send(
        makeMessage({
          status: "error",
          method: null,
          body: `Room ${room} does not exist`,
        })
      );
    }
  };

  public broadcast = (room: number, user: number, message: string, ws: ws) => {
    if (SocketProvider.rooms.has(room)) {
      if (SocketProvider.roomMembers.get(room)!.indexOf(user) === -1) {
        ws.send(
          makeMessage({
            status: "error",
            method: null,
            body: "You are not a member of this room",
          })
        );
        return;
      }
      SocketProvider.rooms.get(room)!.forEach((client) => {
        client.send(
          makeMessage({
            status: "success",
            method: "broadcast",
            body: message,
            user,
          })
        );
        const chat = new ClubChat();
        chat.user_id = user;
        chat.club_id = room;
        chat.message = message;
        this._repository.save(chat);
      });
    } else {
      ws.send(
        makeMessage({
          status: "error",
          method: null,
          body: "Room does not exist",
        })
      );
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
