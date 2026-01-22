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
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [mapRef, center, zoom]);
};