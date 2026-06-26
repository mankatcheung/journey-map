import type { PrismaClient } from '../../generated/prisma/index.js';
import type { IJourneyRepository, JourneyWithDetails } from '../../domain/repositories/journey.repository.interface.ts';
import type { Journey, CreateJourneyInput, UpdateJourneyInput } from '../../domain/entities/journey.entity.ts';

export class PrismaJourneyRepository implements IJourneyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAllByUserId(userId: string): Promise<Journey[]> {
    return this.prisma.journey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Journey | null> {
    return this.prisma.journey.findUnique({ where: { id } });
  }

  async findByIdWithDetails(id: string): Promise<JourneyWithDetails | null> {
    return this.prisma.journey.findUnique({
      where: { id },
      include: {
        locations: { orderBy: { order: 'asc' } },
        routes: true,
      },
    });
  }

  async create(input: CreateJourneyInput): Promise<Journey> {
    return this.prisma.journey.create({
      data: {
        userId: input.userId,
        name: input.name,
        description: input.description ?? null,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
      },
    });
  }

  async update(id: string, input: UpdateJourneyInput): Promise<Journey> {
    return this.prisma.journey.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.startDate !== undefined && { startDate: input.startDate }),
        ...(input.endDate !== undefined && { endDate: input.endDate }),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.journey.delete({ where: { id } });
  }
}
