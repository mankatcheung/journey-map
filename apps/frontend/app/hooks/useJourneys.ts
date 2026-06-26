import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journeysService, type CreateJourneyInput, type UpdateJourneyInput } from '~/services/journeys.service';

export const journeyKeys = {
  all: ['journeys'] as const,
  detail: (id: string) => ['journeys', id] as const,
};

export function useJourneys() {
  return useQuery({
    queryKey: journeyKeys.all,
    queryFn: journeysService.list,
  });
}

export function useJourney(id: string | null) {
  return useQuery({
    queryKey: journeyKeys.detail(id ?? ''),
    queryFn: () => journeysService.get(id!),
    enabled: id !== null,
  });
}

export function useCreateJourney() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: journeysService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: journeyKeys.all }),
  });
}

export function useUpdateJourney(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateJourneyInput) => journeysService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: journeyKeys.all });
      qc.invalidateQueries({ queryKey: journeyKeys.detail(id) });
    },
  });
}

export function useDeleteJourney() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: journeysService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: journeyKeys.all }),
  });
}
