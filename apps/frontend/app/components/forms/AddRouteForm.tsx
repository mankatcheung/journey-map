import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddRoute } from '~/hooks/useRoutes';
import type { Location } from '@journey-map/types';

const schema = z.object({
  fromLocationId: z.string().min(1, 'Select a from location'),
  toLocationId: z.string().min(1, 'Select a to location'),
  notes: z.string().optional(),
}).refine((d) => d.fromLocationId !== d.toLocationId, {
  message: 'From and To must be different',
  path: ['toLocationId'],
});

type FormData = z.infer<typeof schema>;

interface Props {
  journeyId: string;
  locations: Location[];
  onClose: () => void;
}

export function AddRouteForm({ journeyId, locations, onClose }: Props) {
  const { mutate: addRoute, isPending } = useAddRoute(journeyId);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    addRoute(data, {
      onSuccess: onClose,
      onError: (err) => setError('root', { message: (err as Error).message }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Add Route</h3>

        {errors.root && (
          <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">{errors.root.message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <select {...register('fromLocationId')} className="field">
              <option value="">Select location…</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            {errors.fromLocationId && <p className="err">{errors.fromLocationId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <select {...register('toLocationId')} className="field">
              <option value="">Select location…</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            {errors.toLocationId && <p className="err">{errors.toLocationId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <input {...register('notes')} className="field" placeholder="e.g. Train via Brussels" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? 'Adding…' : 'Add Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
