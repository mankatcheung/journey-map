import type { Journey } from '@journey-map/types';
import { useDeleteJourney } from '~/hooks/useJourneys';
import { useMapStore } from '~/store/map.store';

interface Props {
  journeys: Journey[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onEdit: (journey: Journey) => void;
}

export function JourneyList({ journeys, selectedId, onSelect, onEdit }: Props) {
  const { mutate: deleteJourney } = useDeleteJourney();
  const { setSelectedJourney } = useMapStore();

  if (journeys.length === 0) {
    return <p className="px-4 py-3 text-sm text-gray-400">No journeys yet. Create one!</p>;
  }

  return (
    <ul className="divide-y">
      {journeys.map((j) => (
        <li
          key={j.id}
          className={`group flex cursor-pointer items-start justify-between px-4 py-3 hover:bg-gray-50 ${
            selectedId === j.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelect(selectedId === j.id ? null : j.id)}
        >
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-medium ${selectedId === j.id ? 'text-blue-700' : 'text-gray-900'}`}>
              {j.name}
            </p>
            {j.startDate && (
              <p className="mt-0.5 text-xs text-gray-400">
                {new Date(j.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                {j.endDate && ` – ${new Date(j.endDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}`}
              </p>
            )}
            {j.description && (
              <p className="mt-0.5 truncate text-xs text-gray-500">{j.description}</p>
            )}
          </div>
          <div className="ml-2 mt-0.5 flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(j); }}
              className="text-xs text-gray-400 hover:text-blue-500"
              title="Edit journey"
            >
              ✎
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete journey "${j.name}"?`)) {
                  if (selectedId === j.id) setSelectedJourney(null);
                  deleteJourney(j.id);
                }
              }}
              className="text-xs text-gray-300 hover:text-red-500"
              title="Delete journey"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
