import type { Journey, CreateJourneyInput, UpdateJourneyInput } from '../entities/journey.entity.ts';
import type { Location } from '../entities/location.entity.ts';
import type { Route } from '../entities/route.entity.ts';

export type JourneyWithDetails = Journey & {
  locations: Location[];
  routes: Route[];
};

export interface IJourneyRepository {
  findAllByUserId(userId: string): Promise<Journey[]>;
  findById(id: string): Promise<Journey | null>;
  findByIdWithDetails(id: string): Promise<JourneyWithDetails | null>;
  create(input: CreateJourneyInput): Promise<Journey>;
  update(id: string, input: UpdateJourneyInput): Promise<Journey>;
  delete(id: string): Promise<void>;
}
