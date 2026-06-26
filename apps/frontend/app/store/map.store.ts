import { create } from 'zustand';
import type { MapRef } from 'react-map-gl/maplibre';

interface MapState {
  selectedJourneyId: string | null;
  mapRef: MapRef | null;
  clickMode: boolean;
  pendingCoords: [number, number] | null;
  editingLocationId: string | null;
  setSelectedJourney: (id: string | null) => void;
  setMapRef: (ref: MapRef | null) => void;
  setClickMode: (enabled: boolean) => void;
  setPendingCoords: (coords: [number, number] | null) => void;
  setEditingLocationId: (id: string | null) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  selectedJourneyId: null,
  mapRef: null,
  clickMode: false,
  pendingCoords: null,
  editingLocationId: null,
  setSelectedJourney: (id) => set({ selectedJourneyId: id }),
  setMapRef: (ref) => set({ mapRef: ref }),
  setClickMode: (enabled) => set({ clickMode: enabled, pendingCoords: null }),
  setPendingCoords: (coords) => set({ pendingCoords: coords, clickMode: false }),
  setEditingLocationId: (id) => set({ editingLocationId: id }),
}));
