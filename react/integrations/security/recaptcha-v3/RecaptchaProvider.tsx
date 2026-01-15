// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';

const SITE_KEY = 'GOOGLE_SITE_KEY';

export const useRecaptcha = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Scriptni yuklash
    useEffect(() => {
        if (document.getElementById('recaptcha-script')) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
        script.id = 'recaptcha-script';
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);
    }, []);

    // 2. Token olish (Tugma bosilganda ishlatasiz)
    const getRecaptchaToken = useCallback(async (action: string = 'submit') => {
        if (!isLoaded || !window.grecaptcha) {
            console.warn('⚠️ Recaptcha hali yuklanmadi');
            return null;
        }

        return new Promise<string>((resolve) => {
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(SITE_KEY, { action })
                    .then((token: string) => resolve(token));
            });
        });
    }, [isLoaded]);

    return { getRecaptchaToken, isLoaded };
};