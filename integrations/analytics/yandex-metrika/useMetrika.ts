import { useEffect, useCallback } from "react";
import { env } from "../../../core/env";

declare global {
  interface Window {
    ym: (counterId: number, action: string, ...args: unknown[]) => void;
    yandex_metrika_callbacks: Array<() => void>;
  }
}

function loadMetrika(counterId: number): void {
  if (document.querySelector(`script[src*="mc.yandex.ru/metrika"]`)) return;

  (function (m: Window, e: Document, t: string, r: string, i: string) {
    (m[i as keyof Window] as unknown) =
      (m[i as keyof Window] as unknown) ||
      function () {
        ((m[i as keyof Window] as unknown as { a: unknown[] }).a =
          (m[i as keyof Window] as unknown as { a: unknown[] }).a || []).push(arguments);
      };
    const script = e.createElement(t) as HTMLScriptElement;
    script.async = true;
    script.src = r;
    const firstScript = e.getElementsByTagName(t)[0];
    firstScript.parentNode!.insertBefore(script, firstScript);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  window.ym(counterId, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

interface UseMetrikaReturn {
  reachGoal: (goalName: string, params?: Record<string, unknown>) => void;
  trackPageView: (url: string) => void;
}

export const useMetrika = (): UseMetrikaReturn => {
  const counterId = Number(env.YANDEX_METRIKA_ID);

  useEffect(() => {
    if (counterId) loadMetrika(counterId);
  }, [counterId]);

  const reachGoal = useCallback(
    (goalName: string, params?: Record<string, unknown>) => {
      if (!window.ym || !counterId) return;
      window.ym(counterId, "reachGoal", goalName, params);
    },
    [counterId]
  );

  const trackPageView = useCallback(
    (url: string) => {
      if (!window.ym || !counterId) return;
      window.ym(counterId, "hit", url);
    },
    [counterId]
  );

  return { reachGoal, trackPageView };
};
