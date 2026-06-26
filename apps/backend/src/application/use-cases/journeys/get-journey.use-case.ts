import type { IJourneyRepository, JourneyWithDetails } from '../../../domain/repositories/journey.repository.interface.ts';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/index.ts';

export const getJourneyUseCase =
  (journeyRepo: IJourneyRepository) =>
  async (input: { id: string; userId: string }): Promise<JourneyWithDetails> => {
    const journey = await journeyRepo.findByIdWithDetails(input.id);
    if (!journey) throw new NotFoundError('Journey');
    if (journey.userId !== input.userId) throw new ForbiddenError();
    return journey;
  };
