export interface User {
  id: number;
  social_id: string;
  name: string;
  sex: boolean;
  phone: string;
  email: string;
}

export type UserCreate = Omit<User, "id">;

export type UserUpdate = Partial<
  Pick<UserCreate, "name" | "sex" | "phone" | "email">
>;
