import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMapStore } from '~/store/map.store';
import { useAddLocation, useUpdateLocation } from '~/hooks/useLocations';
import type { Location } from '@journey-map/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  journeyId: string | null;
  onClose: () => void;
  location?: Location;
}

export function LocationForm({ journeyId, onClose, location }: Props) {
  const isEdit = !!location;
  const { pendingCoords, setPendingCoords } = useMapStore();
  const { mutate: addLocation, isPending: isAdding } = useAddLocation(journeyId ?? '');
  const { mutate: updateLocation, isPending: isUpdating } = useUpdateLocation(journeyId ?? '');
  const isPending = isEdit ? isUpdating : isAdding;

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: isEdit ? {
      name: location.name,
      date: new Date(location.date).toISOString().slice(0, 10),
      address: location.address ?? '',
      notes: location.notes ?? '',
    } : {
      date: new Date().toISOString().slice(0, 10),
    },
  });

  // In create mode: reset when pendingCoords clears
  useEffect(() => {
    if (!isEdit && !pendingCoords) reset();
  }, [isEdit, pendingCoords, reset]);

  // Create mode: only render when coords are ready
  if (!isEdit && (!pendingCoords || !journeyId)) return null;
  if (isEdit && !journeyId) return null;

  const lat = isEdit ? location.latitude : pendingCoords![1];
  const lng = isEdit ? location.longitude : pendingCoords![0];

  const handleCancel = () => {
    if (isEdit) {
      onClose();
    } else {
      setPendingCoords(null);
    }
  };

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateLocation(
        { locId: location.id, input: data },
        {
          onSuccess: onClose,
          onError: (err) => setError('root', { message: (err as Error).message }),
        },
      );
    } else {
      addLocation(
        { ...data, latitude: lat, longitude: lng },
        {
          onSuccess: () => {
            setPendingCoords(null);
            onClose();
          },
          onError: (err) => setError('root', { message: (err as Error).message }),
        },
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">
          {isEdit ? 'Edit Location' : 'Add Location'}
        </h3>
        <p className="mb-4 text-xs text-gray-400">
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>

        {errors.root && (
          <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">{errors.root.message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input {...register('name')} className="field" placeholder="e.g. Paris" />
            {errors.name && <p className="err">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input {...register('date')} type="date" className="field" />
            {errors.date && <p className="err">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input {...register('address')} className="field" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea {...register('notes')} rows={2} className="field" placeholder="Optional notes…" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
