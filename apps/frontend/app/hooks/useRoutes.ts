import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routesService } from '~/services/routes.service';
import { journeyKeys } from './useJourneys';

export function useAddRoute(journeyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fromLocationId, toLocationId, notes }: { fromLocationId: string; toLocationId: string; notes?: string }) =>
      routesService.add(journeyId, fromLocationId, toLocationId, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: journeyKeys.detail(journeyId) }),
  });
}

export function useDeleteRoute(journeyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (routeId: string) => routesService.delete(journeyId, routeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: journeyKeys.detail(journeyId) }),
  });
}
