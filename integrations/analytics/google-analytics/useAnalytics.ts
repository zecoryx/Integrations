import { useEffect, useCallback } from "react";
import { env } from "../../../core/env";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function loadGtag(measurementId: string): void {
  if (document.querySelector(`script[src*="${measurementId}"]`)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);
}

interface UseAnalyticsReturn {
  trackEvent: (eventName: string, params?: Record<string, unknown>) => void;
  trackPageView: (path: string, title?: string) => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const measurementId = env.GOOGLE_ANALYTICS_ID;

  useEffect(() => {
    if (measurementId) loadGtag(measurementId);
  }, [measurementId]);

  const trackEvent = useCallback(
    (eventName: string, params?: Record<string, unknown>) => {
      if (!window.gtag) return;
      window.gtag("event", eventName, params);
    },
    []
  );

  const trackPageView = useCallback(
    (path: string, title?: string) => {
      if (!window.gtag || !measurementId) return;
      window.gtag("config", measurementId, {
        page_path: path,
        page_title: title,
      });
    },
    [measurementId]
  );

  return { trackEvent, trackPageView };
};
