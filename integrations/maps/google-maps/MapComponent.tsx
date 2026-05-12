import React, { useRef } from "react";
import { useMap } from "./useMap";
import { Coordinates } from "./types";

interface MapProps {
  center: Coordinates;
  zoom?: number;
}

// A component that renders a Google Map.
// @param center The initial center of the map.
// @param zoom The initial zoom level of the map.
export const GoogleMapComponent: React.FC<MapProps> = React.memo(({
  center,
  zoom = 12,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  useMap(mapRef, center, zoom);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px", borderRadius: "10px" }}
    />
  );
});

GoogleMapComponent.displayName = "GoogleMapComponent";