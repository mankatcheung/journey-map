export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export type CreateUserInput = {
  email: string;
  password: string;
  name: string;
};
