import { useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { LocationPopup } from './LocationPopup';
import type { Location } from '@journey-map/types';

interface Props {
  location: Location;
  journeyId: string;
  isDragSource: boolean;
  isDropTarget: boolean;
  onDragStart: (id: string, e: React.MouseEvent) => void;
}

export function LocationMarker({ location, journeyId, isDragSource, isDropTarget, onDragStart }: Props) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Marker
        longitude={location.longitude}
        latitude={location.latitude}
        anchor="center"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setShowPopup(true);
        }}
      >
        {/* Wrapper sized to the dot only — label is absolute so it doesn't shift the anchor */}
        <div
          className={`relative group select-none pointer-events-auto
            ${!isDragSource ? 'cursor-grab' : ''}
            ${isDragSource ? 'cursor-grabbing opacity-50' : ''}
          `}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDragStart(location.id, e);
          }}
        >
          <div
            className={`w-3 h-3 rounded-full border-2 border-white shadow-md transition-all duration-100
              ${isDropTarget
                ? 'bg-green-500 scale-150 ring-2 ring-green-300 ring-offset-1'
                : 'bg-blue-600 group-hover:scale-125'
              }
            `}
          />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 rounded bg-white px-1.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
