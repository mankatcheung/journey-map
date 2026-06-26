import type { User } from '../entities/user.entity.ts';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: { email: string; name: string; passwordHash: string }): Promise<User>;
}
