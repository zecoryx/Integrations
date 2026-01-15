// Lokatsiyani aniqlash va marker qo‘yish.
// @ts-nocheck

import { useState, useEffect } from 'react';

const API_KEY = 'GOOGLE_MAPS_API_KEY';

export const useGoogleMap = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (window.google && window.google.maps) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);
    }, []);

    return isLoaded;
};