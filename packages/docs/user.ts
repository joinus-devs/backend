export const UserUpdateDoc = {
  name: { type: "string", name: "John Doe" },
  sex: { type: "boolean", name: true },
  phone: { type: "string", name: "01012341234" },
  email: { type: "string", name: "john@gmail.com" },
};

export const UserCreateDoc = {
  ...UserUpdateDoc,
};
