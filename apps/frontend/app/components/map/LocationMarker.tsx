import { useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { LocationPopup } from './LocationPopup';
import type { Location } from '@journey-map/types';

interface Props {
  location: Location;
  journeyId: string;
}

export function LocationMarker({ location, journeyId }: Props) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Marker
        longitude={location.longitude}
        latitude={location.latitude}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setShowPopup(true);
        }}
      >
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md group-hover:scale-125 transition-transform" />
          <div className="mt-1 rounded bg-white px-1.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {location.name}
          </div>
        </div>
      </Marker>
      {showPopup && (
        <LocationPopup
          location={location}
          journeyId={journeyId}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
