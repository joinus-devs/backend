export const SigninParmasDoc = {
  email: { type: "string", example: "john@gmail.com" },
  password: { type: "string", example: "joinus" },
};

export const SignupParamsDoc = {
  password: { type: "string", example: "1234" },
  social_id: { type: "string", example: "1234" },
  name: { type: "string", example: "John Doe" },
  sex: { type: "boolean", example: true },
  phone: { type: "string", example: "01012341234" },
  email: { type: "string", example: "john@gmail.com" },
};

export const SinginResponseDoc = {
  token: { type: "string", example: "token" },
};
