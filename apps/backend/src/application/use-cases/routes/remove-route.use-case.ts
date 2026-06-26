import type { IJourneyRepository } from '../../../domain/repositories/journey.repository.interface.ts';
import type { IRouteRepository } from '../../../domain/repositories/route.repository.interface.ts';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/index.ts';

export const removeRouteUseCase =
  (routeRepo: IRouteRepository, journeyRepo: IJourneyRepository) =>
  async (input: { id: string; journeyId: string; userId: string }): Promise<void> => {
    const journey = await journeyRepo.findById(input.journeyId);
    if (!journey) throw new NotFoundError('Journey');
    if (journey.userId !== input.userId) throw new ForbiddenError();

    const route = await routeRepo.findById(input.id);
    if (!route || route.journeyId !== input.journeyId) throw new NotFoundError('Route');

    await routeRepo.delete(input.id);
  };
