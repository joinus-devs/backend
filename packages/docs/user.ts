import { cloneDeep } from "lodash";

const userBase = {
  name: { type: "string", example: "John Doe" },
  sex: { type: "boolean", example: true },
  phone: { type: "string", example: "01012341234" },
  email: { type: "string", example: "john@gmail.com" },
};

export const userDoc = {
  ...cloneDeep(userBase),
  password: { type: "string", example: "1234" },
  social_id: { type: "string", example: "1234" },
};

export const userDtoDoc = cloneDeep(userBase);

export const userUpdateDoc = cloneDeep(userBase);
