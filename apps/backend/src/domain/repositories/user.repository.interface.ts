import type { User, CreateUserInput } from '../entities/user.entity.ts';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput & { passwordHash: string }): Promise<User>;
}
