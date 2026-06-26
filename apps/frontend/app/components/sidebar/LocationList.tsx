import type { Location } from '@journey-map/types';
import { useMapStore } from '~/store/map.store';
import { useDeleteLocation } from '~/hooks/useLocations';

interface Props {
  locations: Location[];
  journeyId: string;
}

export function LocationList({ locations, journeyId }: Props) {
  const { mapRef } = useMapStore();
  const { mutate: deleteLocation } = useDeleteLocation(journeyId);

  if (locations.length === 0) {
    return (
      <p className="px-4 py-2 text-xs text-gray-400">
        No locations yet. Click "+ Add" then pick on the map.
      </p>
    );
  }

  return (
    <ol className="divide-y">
      {locations.map((loc, i) => (
        <li
          key={loc.id}
          className="group flex cursor-pointer items-start gap-3 px-4 py-2.5 hover:bg-gray-50"
          onClick={() =>
            mapRef?.flyTo({ center: [loc.longitude, loc.latitude], zoom: 10, duration: 800 })
          }
        >
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-800">{loc.name}</p>
            <p className="text-xs text-gray-400">
              {new Date(loc.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${loc.name}"?`)) deleteLocation(loc.id);
            }}
            className="mt-0.5 text-xs text-gray-300 opacity-0 hover:text-red-500 group-hover:opacity-100"
          >
            ✕
          </button>
        </li>
      ))}
    </ol>
  );
}
