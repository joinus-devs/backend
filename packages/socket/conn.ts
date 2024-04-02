import ws from "ws";

interface SocketMember {
  user: number;
  conn: SocketConnection;
}

interface SocketConnection extends ws {
  user?: number;
  room?: number;
}

export { SocketConnection, SocketMember };
