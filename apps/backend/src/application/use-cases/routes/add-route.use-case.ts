import type { IJourneyRepository } from '../../../domain/repositories/journey.repository.interface.ts';
import type { ILocationRepository } from '../../../domain/repositories/location.repository.interface.ts';
import type { IRouteRepository } from '../../../domain/repositories/route.repository.interface.ts';
import type { Route } from '../../../domain/entities/route.entity.ts';
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from '../../../domain/errors/index.ts';

type Input = {
  journeyId: string;
  userId: string;
  fromLocationId: string;
  toLocationId: string;
  notes?: string;
};

export const addRouteUseCase =
  (routeRepo: IRouteRepository, locationRepo: ILocationRepository, journeyRepo: IJourneyRepository) =>
  async (input: Input): Promise<Route> => {
    const journey = await journeyRepo.findById(input.journeyId);
    if (!journey) throw new NotFoundError('Journey');
    if (journey.userId !== input.userId) throw new ForbiddenError();

    const [fromLoc, toLoc] = await Promise.all([
      locationRepo.findById(input.fromLocationId),
      locationRepo.findById(input.toLocationId),
    ]);

    if (!fromLoc || fromLoc.journeyId !== input.journeyId) {
      throw new ValidationError('From location does not belong to this journey');
    }
    if (!toLoc || toLoc.journeyId !== input.journeyId) {
      throw new ValidationError('To location does not belong to this journey');
    }

    const existing = await routeRepo.findByEndpoints(input.fromLocationId, input.toLocationId);
    if (existing) throw new ConflictError('Route already exists');

    return routeRepo.create({
      journeyId: input.journeyId,
      fromLocationId: input.fromLocationId,
      toLocationId: input.toLocationId,
      notes: input.notes,
    });
  };
