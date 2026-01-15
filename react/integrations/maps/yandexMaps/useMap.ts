// @ts-nocheck
import { useState, useEffect } from 'react';

const API_KEY = 'YANDEX_API_KEY';

export const useYandexMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.ymaps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=uz_UZ`;
    script.type = 'text/javascript';
    script.onload = () => {
      window.ymaps.ready(() => setIsLoaded(true));
    };
    document.body.appendChild(script);
  }, []);

  return isLoaded;
};