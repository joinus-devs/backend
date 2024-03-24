import { Server } from "http";
import ws from "ws";

interface MessageFromClient {
  method: "join" | "leave" | "broadcast";
  body: string;
  room: number;
  user: number;
}

const makeMessage = (
  status: "success" | "error",
  body: string,
  user?: number
): string => {
  return JSON.stringify({ status, body, user });
};

class SocketProvider {
  static instance: SocketProvider;
  static rooms: Map<number, ws[]> = new Map();
  static roomMembers = new Map<number, number[]>();

  private constructor(server: Server) {
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
              ws.send(makeMessage("error", "Room is required"));
              return;
            }
            SocketProvider.joinRoom(room, ws);
            SocketProvider.addMember(room, user, ws);
            break;
          case "leave":
            if (!room) {
              ws.send(makeMessage("error", "Room is required"));
              return;
            }
            SocketProvider.removeMember(room, user, ws);
            SocketProvider.leaveRoom(room, ws);
            break;
          case "broadcast":
            if (!room) {
              ws.send(makeMessage("error", "Room is required"));
              return;
            }
            SocketProvider.broadcast(room, user, body, ws);
            break;
          default:
            ws.send(makeMessage("error", "Invalid method"));
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

  static joinRoom(room: number, ws: ws) {
    if (SocketProvider.rooms.has(room)) {
      SocketProvider.rooms.get(room)!.push(ws);
      ws.send(makeMessage("success", `Joined room ${room}`));
    } else {
      SocketProvider.rooms.set(room, [ws]);
      ws.send(makeMessage("success", `Created room ${room}`));
    }
  }

  static addMember = (room: number, user: number, ws: ws) => {
    if (SocketProvider.roomMembers.has(room)) {
      SocketProvider.roomMembers.get(room)!.push(user);
      ws.send(makeMessage("success", `Added member ${user} to room ${room}`));
    } else {
      SocketProvider.roomMembers.set(room, [user]);
      ws.send(
        makeMessage("success", `Added member ${user} to new room ${room}`)
      );
    }
  };

  static leaveRoom = (room: number, ws: ws) => {
    if (SocketProvider.rooms.has(room)) {
      const index = SocketProvider.rooms.get(room)!.indexOf(ws);
      if (index > -1) {
        SocketProvider.rooms.get(room)!.splice(index, 1);
        ws.send(makeMessage("success", `Left room ${room}`));
      } else {
        ws.send(makeMessage("error", `You are not in room ${room}`));
      }

      // If room is empty, delete it.
      if (SocketProvider.rooms.get(room)!.length === 0) {
        SocketProvider.rooms.delete(room);
        ws.send(makeMessage("success", `Room ${room} deleted`));
      }
    } else {
      ws.send(makeMessage("error", `Room ${room} does not exist`));
    }
  };

  static removeMember = (room: number, user: number, ws: ws) => {
    if (SocketProvider.roomMembers.has(room)) {
      const index = SocketProvider.roomMembers.get(room)!.indexOf(user);
      if (index > -1) {
        SocketProvider.roomMembers.get(room)!.splice(index, 1);
        ws.send(
          makeMessage("success", `Member ${user} removed from room ${room}`)
        );
      } else {
        ws.send(makeMessage("error", `Member ${user} is not in room ${room}`));
      }
    } else {
      ws.send(makeMessage("error", `Room ${room} does not exist`));
    }
  };

  static broadcast = (room: number, user: number, message: string, ws: ws) => {
    if (SocketProvider.rooms.has(room)) {
      if (SocketProvider.roomMembers.get(room)!.indexOf(user) === -1) {
        ws.send(makeMessage("error", "You are not a member of this room"));
        return;
      }
      SocketProvider.rooms.get(room)!.forEach((client) => {
        client.send(makeMessage("success", message, user));
      });
    } else {
      ws.send(makeMessage("error", "Room does not exist"));
    }
  };

  static getInstance(server: Server) {
    if (!SocketProvider.instance) {
      SocketProvider.instance = new SocketProvider(server);
    }

    return SocketProvider.instance;
  }
}

export default SocketProvider;
