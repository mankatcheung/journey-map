import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useMapStore } from '~/store/map.store';
import { useAddLocation, useUpdateLocation } from '~/hooks/useLocations';
import type { Location } from '@journey-map/types';

interface CityResult {
  name: string;
  label: string;
  lat: number;
  lng: number;
}

async function fetchCities(q: string): Promise<CityResult[]> {
  const res = await fetch(
    `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&layer=city`,
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.features ?? []).map((f: any) => ({
    name: f.properties.name,
    label: [f.properties.name, f.properties.state, f.properties.country]
      .filter(Boolean)
      .join(', '),
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
  }));
}

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

  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [coordsOverride, setCoordsOverride] = useState<[number, number] | null>(null);

  const { register, handleSubmit, reset, setError, setValue, watch, formState: { errors } } = useForm<FormData>({
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

  const nameValue = watch('name') ?? '';

  // Debounce the name input to avoid hammering the geocoding API
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(nameValue), 300);
    return () => clearTimeout(t);
  }, [nameValue]);

  // In create mode: reset form when the pending coords are cleared
  useEffect(() => {
    if (!isEdit && !pendingCoords) reset();
  }, [isEdit, pendingCoords, reset]);

  const { data: citySuggestions = [] } = useQuery({
    queryKey: ['city-autocomplete', debouncedQuery],
    queryFn: () => fetchCities(debouncedQuery),
    enabled: showDropdown && debouncedQuery.length >= 2,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  if (!isEdit && (!pendingCoords || !journeyId)) return null;
  if (isEdit && !journeyId) return null;

  const baseLat = isEdit ? location.latitude : pendingCoords![1];
  const baseLng = isEdit ? location.longitude : pendingCoords![0];
  const effectiveLat = coordsOverride?.[1] ?? baseLat;
  const effectiveLng = coordsOverride?.[0] ?? baseLng;

  const handleCancel = () => {
    if (isEdit) {
      onClose();
    } else {
      setPendingCoords(null);
    }
  };

  const onSubmit = (data: FormData) => {
    const coords = { latitude: effectiveLat, longitude: effectiveLng };
    if (isEdit) {
      updateLocation(
        { locId: location.id, input: { ...data, ...coords } },
        {
          onSuccess: onClose,
          onError: (err) => setError('root', { message: (err as Error).message }),
        },
      );
    } else {
      addLocation(
        { ...data, ...coords },
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
          {effectiveLat.toFixed(5)}, {effectiveLng.toFixed(5)}
        </p>

        {errors.root && (
          <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">{errors.root.message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              {...register('name')}
              value={nameValue}
              onChange={(e) => {
                setValue('name', e.target.value, { shouldValidate: false });
                setCoordsOverride(null);
                setShowDropdown(true);
              }}
              onBlur={() => setShowDropdown(false)}
              autoComplete="off"
              className="field"
              placeholder="e.g. Paris"
            />
            {errors.name && <p className="err">{errors.name.message}</p>}
            {showDropdown && citySuggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                {citySuggestions.map((city) => (
                  <li
                    key={city.label}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                    onMouseDown={(e) => {
                      e.preventDefault(); // keep focus on input so onBlur doesn't fire first
                      setValue('name', city.name, { shouldValidate: true });
                      setValue('address', city.label);
                      setCoordsOverride([city.lng, city.lat]);
                      setShowDropdown(false);
                    }}
                  >
                    {city.label}
                  </li>
                ))}
              </ul>
            )}
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
