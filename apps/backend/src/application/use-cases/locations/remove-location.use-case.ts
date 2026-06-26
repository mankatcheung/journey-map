import type { IJourneyRepository } from '../../../domain/repositories/journey.repository.interface.ts';
import type { ILocationRepository } from '../../../domain/repositories/location.repository.interface.ts';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/index.ts';

export const removeLocationUseCase =
  (locationRepo: ILocationRepository, journeyRepo: IJourneyRepository) =>
  async (input: { id: string; journeyId: string; userId: string }): Promise<void> => {
    const journey = await journeyRepo.findById(input.journeyId);
    if (!journey) throw new NotFoundError('Journey');
    if (journey.userId !== input.userId) throw new ForbiddenError();

    const location = await locationRepo.findById(input.id);
    if (!location || location.journeyId !== input.journeyId) throw new NotFoundError('Location');

    await locationRepo.delete(input.id);
  };
