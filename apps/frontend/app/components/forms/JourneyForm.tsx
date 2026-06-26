import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateJourney, useUpdateJourney } from '~/hooks/useJourneys';
import { useMapStore } from '~/store/map.store';
import type { Journey } from '@journey-map/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function toDateInput(iso: string | null | undefined) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : '';
}

interface Props {
  onClose: () => void;
  journey?: Journey;
}

export function JourneyForm({ onClose, journey }: Props) {
  const isEdit = !!journey;
  const { mutate: createJourney, isPending: isCreating } = useCreateJourney();
  const { mutate: updateJourney, isPending: isUpdating } = useUpdateJourney(journey?.id ?? '');
  const isPending = isEdit ? isUpdating : isCreating;
  const { setSelectedJourney } = useMapStore();

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: isEdit ? {
      name: journey.name,
      description: journey.description ?? undefined,
      startDate: toDateInput(journey.startDate),
      endDate: toDateInput(journey.endDate),
    } : {},
  });

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateJourney(data, {
        onSuccess: onClose,
        onError: (err) => setError('root', { message: (err as Error).message }),
      });
    } else {
      createJourney(data, {
        onSuccess: (created) => {
          setSelectedJourney(created.id);
          onClose();
        },
        onError: (err) => setError('root', { message: (err as Error).message }),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {isEdit ? 'Edit Journey' : 'New Journey'}
        </h3>

        {errors.root && (
          <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">{errors.root.message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input {...register('name')} className="field" placeholder="e.g. Europe Summer 2025" />
            {errors.name && <p className="err">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea {...register('description')} rows={2} className="field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start date</label>
              <input {...register('startDate')} type="date" className="field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End date</label>
              <input {...register('endDate')} type="date" className="field" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Journey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
