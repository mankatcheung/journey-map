import type { IJourneyRepository } from '../../../domain/repositories/journey.repository.interface.ts';
import type { Journey } from '../../../domain/entities/journey.entity.ts';

export const getJourneysUseCase =
  (journeyRepo: IJourneyRepository) =>
  async (input: { userId: string }): Promise<Journey[]> => {
    return journeyRepo.findAllByUserId(input.userId);
  };
