import type { Route, CreateRouteInput } from '../entities/route.entity.ts';

export interface IRouteRepository {
  findById(id: string): Promise<Route | null>;
  findByJourneyId(journeyId: string): Promise<Route[]>;
  findByEndpoints(fromLocationId: string, toLocationId: string): Promise<Route | null>;
  create(input: CreateRouteInput): Promise<Route>;
  delete(id: string): Promise<void>;
}
