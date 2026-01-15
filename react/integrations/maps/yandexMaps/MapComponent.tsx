// @ts-nocheck
import React, { useEffect, useRef } from 'react';

interface MapProps {
    center: [number, number]; // [lat, lng]
    zoom?: number;
}

export const YandexMapComponent: React.FC<MapProps> = ({ center, zoom = 12 }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const API_KEY = 'SIZNING_YANDEX_API_KEY';

    useEffect(() => {
        if (!window.ymaps) {
            const script = document.createElement('script');
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=uz_UZ`;
            script.type = 'text/javascript';
            script.onload = () => window.ymaps.ready(initMap);
            document.body.appendChild(script);
        } else {
            window.ymaps.ready(initMap);
        }

        function initMap() {
            if (mapRef.current) {
                // Eski xaritani tozalash (qayta chizilmasligi uchun)
                mapRef.current.innerHTML = '';

                new window.ymaps.Map(mapRef.current, {
                    center: center,
                    zoom: zoom,
                    controls: ['zoomControl', 'fullscreenControl']
                });
            }
        }
    }, [center, zoom]);

    return <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '10px' }} />;
};