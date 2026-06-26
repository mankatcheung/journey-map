import type { IJourneyRepository } from '../../../domain/repositories/journey.repository.interface.ts';
import type { Journey } from '../../../domain/entities/journey.entity.ts';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/index.ts';

type Input = {
  id: string;
  userId: string;
  name?: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export const updateJourneyUseCase =
  (journeyRepo: IJourneyRepository) =>
  async (input: Input): Promise<Journey> => {
    const journey = await journeyRepo.findById(input.id);
    if (!journey) throw new NotFoundError('Journey');
    if (journey.userId !== input.userId) throw new ForbiddenError();

    return journeyRepo.update(input.id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.startDate !== undefined && {
        startDate: input.startDate ? new Date(input.startDate) : null,
      }),
      ...(input.endDate !== undefined && {
        endDate: input.endDate ? new Date(input.endDate) : null,
      }),
    });
  };
