import type { PrismaClient } from '../../generated/prisma/index.js';
import type { IRouteRepository } from '../../domain/repositories/route.repository.interface.ts';
import type { Route, CreateRouteInput } from '../../domain/entities/route.entity.ts';

export class PrismaRouteRepository implements IRouteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Route | null> {
    return this.prisma.route.findUnique({ where: { id } });
  }

  async findByJourneyId(journeyId: string): Promise<Route[]> {
    return this.prisma.route.findMany({ where: { journeyId } });
  }

  async findByEndpoints(fromLocationId: string, toLocationId: string): Promise<Route | null> {
    return this.prisma.route.findUnique({
      where: { fromLocationId_toLocationId: { fromLocationId, toLocationId } },
    });
  }

  async create(input: CreateRouteInput): Promise<Route> {
    return this.prisma.route.create({
      data: {
        journeyId: input.journeyId,
        fromLocationId: input.fromLocationId,
        toLocationId: input.toLocationId,
        notes: input.notes ?? null,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.route.delete({ where: { id } });
  }
}
