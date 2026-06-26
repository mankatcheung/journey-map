import { Popup } from 'react-map-gl/maplibre';
import { useDeleteLocation } from '~/hooks/useLocations';
import { useMapStore } from '~/store/map.store';
import type { Location } from '@journey-map/types';

interface Props {
  location: Location;
  journeyId: string;
  onClose: () => void;
}

export function LocationPopup({ location, journeyId, onClose }: Props) {
  const { mutate: deleteLocation, isPending } = useDeleteLocation(journeyId);
  const { setEditingLocationId } = useMapStore();

  const handleEdit = () => {
    onClose();
    setEditingLocationId(location.id);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${location.name}"?`)) {
      deleteLocation(location.id, { onSuccess: onClose });
    }
  };

  return (
    <Popup
      longitude={location.longitude}
      latitude={location.latitude}
      anchor="top"
      onClose={onClose}
      closeOnClick={false}
      className="z-20"
    >
      <div className="min-w-[180px] p-1">
        <p className="font-semibold text-gray-900">{location.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {new Date(location.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
        </p>
        {location.address && <p className="text-xs text-gray-600 mt-1">{location.address}</p>}
        {location.notes && (
          <p className="text-xs text-gray-700 mt-2 italic border-t pt-2">{location.notes}</p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </p>
        <div className="mt-2 flex gap-3">
          <button
            onClick={handleEdit}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </Popup>
  );
}
