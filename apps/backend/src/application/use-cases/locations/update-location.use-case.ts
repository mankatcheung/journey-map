import type { IJourneyRepository } from '../../../domain/repositories/journey.repository.interface.ts';
import type { ILocationRepository } from '../../../domain/repositories/location.repository.interface.ts';
import type { Location } from '../../../domain/entities/location.entity.ts';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/index.ts';

type Input = {
  id: string;
  journeyId: string;
  userId: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  address?: string | null;
  date?: string;
  notes?: string | null;
  order?: number;
};

export const updateLocationUseCase =
  (locationRepo: ILocationRepository, journeyRepo: IJourneyRepository) =>
  async (input: Input): Promise<Location> => {
    const journey = await journeyRepo.findById(input.journeyId);
    if (!journey) throw new NotFoundError('Journey');
    if (journey.userId !== input.userId) throw new ForbiddenError();

    const location = await locationRepo.findById(input.id);
    if (!location || location.journeyId !== input.journeyId) throw new NotFoundError('Location');

    return locationRepo.update(input.id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.latitude !== undefined && { latitude: input.latitude }),
      ...(input.longitude !== undefined && { longitude: input.longitude }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.date !== undefined && { date: new Date(input.date) }),
      ...(input.notes !== undefined && { notes: input.notes }),
      ...(input.order !== undefined && { order: input.order }),
    });
  };
