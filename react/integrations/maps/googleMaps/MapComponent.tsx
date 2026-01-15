// @ts-nocheck
import React, { useEffect, useRef } from 'react';

interface MapProps {
    center: { lat: number; lng: number };
    zoom?: number;
}

export const GoogleMapComponent: React.FC<MapProps> = ({ center, zoom = 12 }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const API_KEY = 'SIZNING_GOOGLE_MAPS_KEY';

    useEffect(() => {
        // Scriptni tekshiramiz
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
            script.async = true;
            script.onload = initMap;
            document.body.appendChild(script);
        } else {
            initMap();
        }

        function initMap() {
            if (mapRef.current) {
                new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                });
            }
        }
    }, [center, zoom]);

    return <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '10px' }} />;
};