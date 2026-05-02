import React, { useEffect } from "react";
import { env } from "../../../core/env";
import { Coordinates } from "./types";

declare global {
  interface Window {
    ymaps: any;
  }
}

// A custom hook for initializing a Yandex Map.
// It handles the loading of the Yandex Maps script and the initialization of the map.
// @param mapRef A React ref to the map container element.
// @param center The initial center of the map.
// @param zoom The initial zoom level of the map.
export const useMap = (
  mapRef: React.RefObject<HTMLDivElement>,
  center: Coordinates,
  zoom: number
) => {
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current) {
        // Clear the map container to prevent re-rendering issues.
        mapRef.current.innerHTML = "";
        new window.ymaps.Map(mapRef.current, {
          center,
          zoom,
          controls: ["zoomControl", "fullscreenControl"],
        });
      }
    };

    if (!window.ymaps) {
      // Guard against duplicate script injection if this hook rerenders
      const existing = document.querySelector('script[src*="api-maps.yandex.ru"]');
      if (existing) {
        existing.addEventListener("load", () => window.ymaps.ready(initMap));
        return;
      }
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${env.YANDEX_MAPS_API_KEY}&lang=en_US`;
      script.type = "text/javascript";
      script.onload = () => window.ymaps.ready(initMap);
      document.body.appendChild(script);
    } else {
      window.ymaps.ready(initMap);
    }
  // JSON.stringify(center) prevents infinite re-renders when parent passes
  // a new array literal like [41.29, 69.24] on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, JSON.stringify(center), zoom]);
};