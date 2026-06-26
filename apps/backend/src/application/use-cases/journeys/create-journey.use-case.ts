import type { IJourneyRepository } from '../../../domain/repositories/journey.repository.interface.ts';
import type { Journey } from '../../../domain/entities/journey.entity.ts';

type Input = {
  userId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

export const createJourneyUseCase =
  (journeyRepo: IJourneyRepository) =>
  async (input: Input): Promise<Journey> => {
    return journeyRepo.create({
      userId: input.userId,
      name: input.name,
      description: input.description,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
    });
  };
