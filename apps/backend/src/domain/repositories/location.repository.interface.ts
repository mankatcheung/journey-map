import type { Location, CreateLocationInput, UpdateLocationInput } from '../entities/location.entity.ts';

export interface ILocationRepository {
  findById(id: string): Promise<Location | null>;
  findAllByJourneyId(journeyId: string): Promise<Location[]>;
  getMaxOrderForJourney(journeyId: string): Promise<number>;
  create(input: CreateLocationInput & { order: number }): Promise<Location>;
  update(id: string, input: UpdateLocationInput): Promise<Location>;
  delete(id: string): Promise<void>;
}
