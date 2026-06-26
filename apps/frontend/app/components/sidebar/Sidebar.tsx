import { useState } from 'react';
import { useAuthStore } from '~/store/auth.store';
import { useMapStore } from '~/store/map.store';
import { useJourneys, useJourney } from '~/hooks/useJourneys';
import { JourneyList } from './JourneyList';
import { LocationList } from './LocationList';
import { AddJourneyForm } from '../forms/AddJourneyForm';
import { AddLocationForm } from '../forms/AddLocationForm';
import { AddRouteForm } from '../forms/AddRouteForm';
import { useRouter } from '@tanstack/react-router';

export function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const { selectedJourneyId, setSelectedJourney, setClickMode, clickMode } = useMapStore();
  const { data: journeys = [], isLoading } = useJourneys();
  const { data: selectedJourney } = useJourney(selectedJourneyId);
  const router = useRouter();

  const [modal, setModal] = useState<'add-journey' | 'add-location' | 'add-route' | null>(null);

  const handleLogout = () => {
    clearAuth();
    router.navigate({ to: '/auth' });
  };

  return (
    <aside className="flex h-full w-80 flex-col bg-white shadow-xl z-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗺</span>
          <span className="font-bold text-gray-900">Journey Map</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{user?.name}</span>
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500">
            Logout
          </button>
        </div>
      </div>

      {/* Journey list */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Journeys</h2>
          <button
            onClick={() => setModal('add-journey')}
            className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white hover:bg-blue-700"
          >
            + New
          </button>
        </div>

        {isLoading ? (
          <p className="px-4 text-sm text-gray-400">Loading…</p>
        ) : (
          <JourneyList
            journeys={journeys}
            selectedId={selectedJourneyId}
            onSelect={setSelectedJourney}
          />
        )}

        {/* Location list when a journey is selected */}
        {selectedJourney && (
          <div className="border-t mt-2">
            <div className="flex items-center justify-between px-4 py-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Locations</h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setClickMode(!clickMode)}
                  className={`rounded px-2 py-0.5 text-xs ${clickMode ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {clickMode ? 'Cancel' : '+ Add'}
                </button>
                {selectedJourney.locations.length >= 2 && (
                  <button
                    onClick={() => setModal('add-route')}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
                  >
                    + Route
                  </button>
                )}
              </div>
            </div>
            <LocationList locations={selectedJourney.locations} journeyId={selectedJourney.id} />
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === 'add-journey' && <AddJourneyForm onClose={() => setModal(null)} />}
      {modal === 'add-route' && selectedJourney && (
        <AddRouteForm
          journeyId={selectedJourney.id}
          locations={selectedJourney.locations}
          onClose={() => setModal(null)}
        />
      )}
      {/* AddLocationForm opens when clickMode coords are set */}
      <AddLocationForm journeyId={selectedJourneyId} onClose={() => {}} />
    </aside>
  );
}
