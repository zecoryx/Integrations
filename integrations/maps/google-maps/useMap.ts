import React, { useEffect } from "react";
import { env } from "../../../core/env";
import { Coordinates } from "./types";

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

/**
 * A custom hook for initializing a Google Map.
 * It handles the loading of the Google Maps script and the initialization of the map.
 *
 * @param mapRef A React ref to the map container element.
 * @param center The initial center of the map.
 * @param zoom The initial zoom level of the map.
 */
export const useMap = (
  mapRef: React.RefObject<HTMLDivElement>,
  center: Coordinates,
  zoom: number
) => {
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current) {
        new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
        });
      }
    };

    if (!window.google) {
      // Guard against duplicate script injection if this hook rerenders
      const existing = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existing) {
        existing.addEventListener("load", initMap);
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  // JSON.stringify(center) prevents infinite re-renders when parent passes
  // a new object literal like { lat: 41.29, lng: 69.24 } on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, JSON.stringify(center), zoom]);
};