import type { PrismaClient } from '../../generated/prisma/index.js';
import type { ILocationRepository } from '../../domain/repositories/location.repository.interface.ts';
import type { Location, CreateLocationInput, UpdateLocationInput } from '../../domain/entities/location.entity.ts';

export class PrismaLocationRepository implements ILocationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Location | null> {
    return this.prisma.location.findUnique({ where: { id } });
  }

  async findAllByJourneyId(journeyId: string): Promise<Location[]> {
    return this.prisma.location.findMany({
      where: { journeyId },
      orderBy: { order: 'asc' },
    });
  }

  async getMaxOrderForJourney(journeyId: string): Promise<number> {
    const result = await this.prisma.location.aggregate({
      where: { journeyId },
      _max: { order: true },
    });
    return result._max.order ?? 0;
  }

  async create(input: CreateLocationInput & { order: number }): Promise<Location> {
    return this.prisma.location.create({
      data: {
        journeyId: input.journeyId,
        name: input.name,
        latitude: input.latitude,
        longitude: input.longitude,
        address: input.address ?? null,
        date: input.date,
        notes: input.notes ?? null,
        order: input.order,
      },
    });
  }

  async update(id: string, input: UpdateLocationInput): Promise<Location> {
    return this.prisma.location.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.latitude !== undefined && { latitude: input.latitude }),
        ...(input.longitude !== undefined && { longitude: input.longitude }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.date !== undefined && { date: input.date }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.order !== undefined && { order: input.order }),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.location.delete({ where: { id } });
  }
}
