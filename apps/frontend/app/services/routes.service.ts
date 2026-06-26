import { api } from './api';
import type { Route } from '@journey-map/types';

export const routesService = {
  add: (journeyId: string, fromLocationId: string, toLocationId: string, notes?: string) =>
    api.post<{ route: Route }>(`/journeys/${journeyId}/routes`, { fromLocationId, toLocationId, notes }).then((r) => r.route),

  delete: (journeyId: string, routeId: string) =>
    api.delete<void>(`/journeys/${journeyId}/routes/${routeId}`),
};
