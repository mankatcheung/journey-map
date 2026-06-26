import type { PrismaClient } from '../../generated/prisma/index.js';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface.ts';
import type { User } from '../../domain/entities/user.entity.ts';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(input: { email: string; name: string; passwordHash: string }): Promise<User> {
    return this.prisma.user.create({ data: input });
  }
}
