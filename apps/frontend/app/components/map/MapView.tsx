import { useRef, useCallback, useEffect } from 'react';
import Map, { type MapRef, type MapMouseEvent } from 'react-map-gl/maplibre';
import { useMapStore } from '~/store/map.store';
import { LocationMarker } from './LocationMarker';
import { RouteLayer } from './RouteLayer';
import type { JourneyWithDetails } from '@journey-map/types';

interface Props {
  journey: JourneyWithDetails | null;
}

export function MapView({ journey }: Props) {
  const mapRef = useRef<MapRef>(null);
  const { setMapRef, clickMode, setPendingCoords } = useMapStore();

  useEffect(() => {
    setMapRef(mapRef.current);
    return () => setMapRef(null);
  }, [setMapRef]);

  useEffect(() => {
    if (journey && journey.locations.length > 0 && mapRef.current) {
      const lats = journey.locations.map((l) => l.latitude);
      const lngs = journey.locations.map((l) => l.longitude);
      const padding = 60;
      mapRef.current.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding, duration: 800 },
      );
    }
  }, [journey?.id]);

  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      if (clickMode) {
        setPendingCoords([e.lngLat.lng, e.lngLat.lat]);
      }
    },
    [clickMode, setPendingCoords],
  );

  return (
    <div className={`flex-1 relative ${clickMode ? 'cursor-crosshair' : ''}`}>
      {clickMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-blue-600 px-4 py-2 text-sm text-white shadow-lg">
          Click on the map to pick a location
        </div>
      )}
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 0, latitude: 20, zoom: 2 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        onClick={handleClick}
      >
        {journey?.routes.map((route) => (
          <RouteLayer key={route.id} route={route} locations={journey.locations} />
        ))}
        {journey?.locations.map((location) => (
          <LocationMarker key={location.id} location={location} journeyId={journey.id} />
        ))}
      </Map>
    </div>
  );
}
