import { api } from './api';
import type { Location } from '@journey-map/types';

export type AddLocationInput = {
  name: string;
  latitude: number;
  longitude: number;
  date: string;
  address?: string;
  notes?: string;
};

export type UpdateLocationInput = Partial<AddLocationInput> & {
  order?: number;
};

export const locationsService = {
  add: (journeyId: string, input: AddLocationInput) =>
    api.post<{ location: Location }>(`/journeys/${journeyId}/locations`, input).then((r) => r.location),

  update: (journeyId: string, locId: string, input: UpdateLocationInput) =>
    api.put<{ location: Location }>(`/journeys/${journeyId}/locations/${locId}`, input).then((r) => r.location),

  delete: (journeyId: string, locId: string) =>
    api.delete<void>(`/journeys/${journeyId}/locations/${locId}`),
};
