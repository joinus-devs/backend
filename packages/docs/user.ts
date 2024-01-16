export const UserUpdateDoc = {
  name: { type: "number" },
  sex: { type: "boolean" },
  phone: { type: "string" },
  email: { type: "string" },
};

export const UserCreateDoc = {
  ...UserUpdateDoc,
  phone: { type: "string" },
  email: { type: "string" },
};
