import { DEFAULT_LOCALE, supportedLocales, type SupportedLocale } from "./locales";

export const LOCALE_PREFERENCE_STORAGE_KEY = "paperclip.locale";

type LocaleStorage = Pick<Storage, "getItem" | "setItem">;

function isSupportedLocale(value: string | null): value is SupportedLocale {
  return value !== null && supportedLocales.includes(value);
}

function browserStorage(): LocaleStorage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readLocalePreference(
  storage: Pick<LocaleStorage, "getItem"> | null = browserStorage(),
): SupportedLocale {
  try {
    const locale = storage?.getItem(LOCALE_PREFERENCE_STORAGE_KEY) ?? null;
    return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function writeLocalePreference(
  locale: SupportedLocale,
  storage: Pick<LocaleStorage, "setItem"> | null = browserStorage(),
) {
  try {
    storage?.setItem(LOCALE_PREFERENCE_STORAGE_KEY, locale);
  } catch {
    // Language changes still work when browser storage is unavailable.
  }
}
