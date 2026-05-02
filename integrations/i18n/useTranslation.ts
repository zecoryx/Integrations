import { useState, useCallback } from "react";
import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import en from "./locales/en.json";

type Locale = "uz" | "ru" | "en";

const locales: Record<Locale, Record<string, unknown>> = { uz, ru, en };

const STORAGE_KEY = "app_locale";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return Object.entries(params).reduce(
    (acc, [key, val]) => acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(val)),
    str
  );
}

interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  availableLocales: Locale[];
}

const defaultLocale = (): Locale => {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && saved in locales) return saved;
  const browser = navigator.language.split("-")[0] as Locale;
  return browser in locales ? browser : "uz";
};

export const useTranslation = (): UseTranslationReturn => {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(STORAGE_KEY, newLocale);
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const translations = locales[locale];
      const value = getNestedValue(translations, key);
      return interpolate(value, params);
    },
    [locale]
  );

  return { t, locale, setLocale, availableLocales: ["uz", "ru", "en"] };
};
