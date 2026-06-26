import type { IJourneyRepository } from '../../../domain/repositories/journey.repository.interface.ts';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/index.ts';

export const deleteJourneyUseCase =
  (journeyRepo: IJourneyRepository) =>
  async (input: { id: string; userId: string }): Promise<void> => {
    const journey = await journeyRepo.findById(input.id);
    if (!journey) throw new NotFoundError('Journey');
    if (journey.userId !== input.userId) throw new ForbiddenError();
    await journeyRepo.delete(input.id);
  };
