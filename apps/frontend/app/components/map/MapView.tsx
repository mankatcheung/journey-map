import { useRef, useCallback, useEffect, useLayoutEffect, useState } from "react";
import Map, { type MapRef, type MapMouseEvent } from "react-map-gl/maplibre";

// useLayoutEffect on the client (for synchronous listener attachment before paint),
// useEffect on the server (avoids SSR hydration mismatch warnings).
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { useMapStore } from "~/store/map.store";
import { LocationMarker } from "./LocationMarker";
import { RouteLayer } from "./RouteLayer";
import { useAddRoute } from "~/hooks/useRoutes";
import type { JourneyWithDetails } from "@journey-map/types";

interface DragState {
  fromId: string;
  toId: string | null;
  mousePos: { x: number; y: number };
}

interface Props {
  journey: JourneyWithDetails | null;
}

export function MapView({ journey }: Props) {
  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setMapRef, clickMode, setPendingCoords } = useMapStore();
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const addRoute = useAddRoute(journey?.id ?? "");
  const mutateRef = useRef(addRoute.mutate);

  useEffect(() => {
    mutateRef.current = addRoute.mutate;
  }, [addRoute.mutate]);

  // Sync drag state to ref synchronously before paint so mouse listeners see latest state
  useIsomorphicLayoutEffect(() => {
    dragRef.current = drag;
  }, [drag]);

  useEffect(() => {
    setMapRef(mapRef.current);
    return () => setMapRef(null);
  }, [setMapRef]);

  useEffect(() => {
    if (journey && journey.locations.length > 0 && mapRef.current) {
      const lats = journey.locations.map((l) => l.latitude);
      const lngs = journey.locations.map((l) => l.longitude);
      mapRef.current.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 60, duration: 800 },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-fly when journey changes, not on every update
  }, [journey?.id]);

  const handleDragStart = useCallback((fromId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mapRef.current?.dragPan.disable();
    setDrag({
      fromId,
      toId: null,
      mousePos: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    });
  }, []);

  const isDragging = drag !== null;

  // Use useIsomorphicLayoutEffect so listeners are attached before the browser can fire mousemove/mouseup.
  // This runs synchronously after the commit that sets isDragging = true, eliminating the window
  // where a quick drag-release could fire mouseup before the listener is in place.
  useIsomorphicLayoutEffect(() => {
    if (!isDragging) return;

    // Capture ref and session data at effect start to avoid stale ref in cleanup
    const map = mapRef.current;
    const locations = journey?.locations ?? [];

    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d || !containerRef.current || !map) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      let toId: string | null = null;
      let minDist = 28; // snap threshold in px
      for (const loc of locations) {
        if (loc.id === d.fromId) continue;
        const sp = map.project([loc.longitude, loc.latitude]);
        const dist = Math.hypot(sp.x - mousePos.x, sp.y - mousePos.y);
        if (dist < minDist) {
          minDist = dist;
          toId = loc.id;
        }
      }

      setDrag((prev) => (prev ? { ...prev, toId, mousePos } : null));
    };

    const onUp = () => {
      const d = dragRef.current;
      if (d?.toId) {
        mutateRef.current({ fromLocationId: d.fromId, toLocationId: d.toId });
      }
      map?.dragPan.enable();
      setDrag(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      map?.dragPan.enable();
    };
  }, [isDragging, journey]);

  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      if (clickMode) setPendingCoords([e.lngLat.lng, e.lngLat.lat]);
    },
    [clickMode, setPendingCoords],
  );

  // Compute SVG drag line endpoints each render
  let dragOverlay: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    snapped: boolean;
  } | null = null;
  if (drag && mapRef.current) {
    const fromLoc = journey?.locations.find((l) => l.id === drag.fromId);
    if (fromLoc) {
      const from = mapRef.current.project([
        fromLoc.longitude,
        fromLoc.latitude,
      ]);
      const toLoc = drag.toId
        ? journey?.locations.find((l) => l.id === drag.toId)
        : undefined;
      const to = toLoc
        ? mapRef.current.project([toLoc.longitude, toLoc.latitude])
        : drag.mousePos;
      dragOverlay = {
        x1: from.x,
        y1: from.y,
        x2: to.x,
        y2: to.y,
        snapped: !!drag.toId,
      };
    }
  }

  return (
    <div
      ref={containerRef}
      className={`flex-1 relative ${clickMode ? "cursor-crosshair" : drag ? "cursor-grabbing" : ""}`}
    >
      {clickMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-blue-600 px-4 py-2 text-sm text-white shadow-lg">
          Click on the map to pick a location
        </div>
      )}
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 0, latitude: 20, zoom: 2 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        onClick={handleClick}
      >
        {journey?.routes.map((route) => (
          <RouteLayer
            key={route.id}
            route={route}
            locations={journey.locations}
          />
        ))}
        {journey?.locations.map((location) => (
          <LocationMarker
            key={location.id}
            location={location}
            journeyId={journey.id}
            isDragSource={drag?.fromId === location.id}
            isDropTarget={drag?.toId === location.id}
            onDragStart={handleDragStart}
          />
        ))}
      </Map>
      {dragOverlay && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <line
            x1={dragOverlay.x1}
            y1={dragOverlay.y1}
            x2={dragOverlay.x2}
            y2={dragOverlay.y2}
            stroke={dragOverlay.snapped ? "#22c55e" : "#3b82f6"}
            strokeWidth={2.5}
            strokeDasharray="6 3"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
