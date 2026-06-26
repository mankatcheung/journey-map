import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '~/store/auth.store';
import { useMapStore } from '~/store/map.store';
import { useJourney } from '~/hooks/useJourneys';
import { MapView } from '~/components/map/MapView';
import { Sidebar } from '~/components/sidebar/Sidebar';

export const Route = createFileRoute('/map')({
  beforeLoad: () => {
    const { token } = useAuthStore.getState();
    if (!token) throw redirect({ to: '/auth' });
  },
  component: MapPage,
});

function MapPage() {
  const { selectedJourneyId } = useMapStore();
  const { data: journey = null } = useJourney(selectedJourneyId);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MapView journey={journey} />
    </div>
  );
}
