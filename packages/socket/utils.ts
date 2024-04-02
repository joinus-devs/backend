type MessageMethod = "join" | "leave" | "broadcast";

type ResponseStatus = "success" | "error";

interface MessageFromClient {
  method: MessageMethod;
  body: string;
  room: number;
  user: number;
}

interface MessageToClient {
  method: MessageMethod;
  status: ResponseStatus;
  body: string;
  user: number;
  users: number[];
}

type SuccessMessage = Omit<MessageToClient, "status">;

type ErrorMessage = Pick<MessageToClient, "body">;

const success = ({ method, body, user, users }: SuccessMessage) => {
  return JSON.stringify({
    status: "success",
    method,
    body: { message: body, timestamp: Date.now() },
    user,
    users,
  });
};

const error = ({ body }: ErrorMessage) => {
  return JSON.stringify({
    status: "error",
    method: null,
    body: { message: body, timestamp: Date.now() },
  });
};

export { MessageFromClient, error, success };
