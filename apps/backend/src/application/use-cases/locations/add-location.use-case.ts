import type { IJourneyRepository } from '../../../domain/repositories/journey.repository.interface.ts';
import type { ILocationRepository } from '../../../domain/repositories/location.repository.interface.ts';
import type { Location } from '../../../domain/entities/location.entity.ts';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/index.ts';

type Input = {
  journeyId: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  date: string;
  notes?: string;
};

export const addLocationUseCase =
  (locationRepo: ILocationRepository, journeyRepo: IJourneyRepository) =>
  async (input: Input): Promise<Location> => {
    const journey = await journeyRepo.findById(input.journeyId);
    if (!journey) throw new NotFoundError('Journey');
    if (journey.userId !== input.userId) throw new ForbiddenError();

    const maxOrder = await locationRepo.getMaxOrderForJourney(input.journeyId);

    return locationRepo.create({
      journeyId: input.journeyId,
      name: input.name,
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address,
      date: new Date(input.date),
      notes: input.notes,
      order: maxOrder + 1,
    });
  };
