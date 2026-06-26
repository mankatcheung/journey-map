import { useMutation, useQueryClient } from '@tanstack/react-query';
import { locationsService, type AddLocationInput, type UpdateLocationInput } from '~/services/locations.service';
import { journeyKeys } from './useJourneys';

export function useAddLocation(journeyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddLocationInput) => locationsService.add(journeyId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: journeyKeys.detail(journeyId) }),
  });
}

export function useUpdateLocation(journeyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ locId, input }: { locId: string; input: UpdateLocationInput }) =>
      locationsService.update(journeyId, locId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: journeyKeys.detail(journeyId) }),
  });
}

export function useDeleteLocation(journeyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (locId: string) => locationsService.delete(journeyId, locId),
    onSuccess: () => qc.invalidateQueries({ queryKey: journeyKeys.detail(journeyId) }),
  });
}
