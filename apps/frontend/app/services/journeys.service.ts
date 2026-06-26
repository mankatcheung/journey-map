import { api } from './api';
import type { Journey, JourneyWithDetails } from '@journey-map/types';

export type CreateJourneyInput = {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

export type UpdateJourneyInput = Partial<CreateJourneyInput>;

export const journeysService = {
  list: () => api.get<{ journeys: Journey[] }>('/journeys').then((r) => r.journeys),

  get: (id: string) =>
    api.get<{ journey: JourneyWithDetails }>(`/journeys/${id}`).then((r) => r.journey),

  create: (input: CreateJourneyInput) =>
    api.post<{ journey: Journey }>('/journeys', input).then((r) => r.journey),

  update: (id: string, input: UpdateJourneyInput) =>
    api.put<{ journey: Journey }>(`/journeys/${id}`, input).then((r) => r.journey),

  delete: (id: string) => api.delete<void>(`/journeys/${id}`),
};
