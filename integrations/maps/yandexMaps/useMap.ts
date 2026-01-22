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
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${env.YANDEX_MAPS_API_KEY}&lang=en_US`;
      script.type = "text/javascript";
      script.onload = () => window.ymaps.ready(initMap);
      document.body.appendChild(script);
    } else {
      window.ymaps.ready(initMap);
    }
  }, [mapRef, center, zoom]);
};