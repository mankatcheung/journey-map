import { Source, Layer } from 'react-map-gl/maplibre';
import type { Route, Location } from '@journey-map/types';

interface Props {
  route: Route;
  locations: Location[];
}

export function RouteLayer({ route, locations }: Props) {
  const from = locations.find((l) => l.id === route.fromLocationId);
  const to = locations.find((l) => l.id === route.toLocationId);
  if (!from || !to) return null;

  const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    properties: { notes: route.notes },
    geometry: {
      type: 'LineString',
      coordinates: [
        [from.longitude, from.latitude],
        [to.longitude, to.latitude],
      ],
    },
  };

  return (
    <Source id={`route-${route.id}`} type="geojson" data={geojson}>
      <Layer
        id={`route-line-${route.id}`}
        type="line"
        paint={{
          'line-color': '#3b82f6',
          'line-width': 2.5,
          'line-dasharray': [2, 1.5],
          'line-opacity': 0.85,
        }}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
      />
    </Source>
  );
}
