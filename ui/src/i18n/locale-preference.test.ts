import { afterEach, describe, expect, it, vi } from "vitest";
import { i18n, setLocale } from ".";
import { DEFAULT_LOCALE, supportedLocales } from "./locales";
import {
  LOCALE_PREFERENCE_STORAGE_KEY,
  readLocalePreference,
  writeLocalePreference,
} from "./locale-preference";

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("locale preference", () => {
  afterEach(async () => {
    vi.unstubAllGlobals();
    await i18n.changeLanguage(DEFAULT_LOCALE);
  });

  it("only exposes the two product-supported locales", () => {
    expect(supportedLocales).toEqual(["zh-CN", "en"]);
  });

  it("uses Chinese when no valid preference is stored", () => {
    expect(readLocalePreference(createStorage())).toBe(DEFAULT_LOCALE);
    expect(
      readLocalePreference(createStorage({ [LOCALE_PREFERENCE_STORAGE_KEY]: "fr" })),
    ).toBe(DEFAULT_LOCALE);
  });

  it("persists and restores a supported locale", () => {
    const storage = createStorage();

    writeLocalePreference("en", storage);

    expect(storage.getItem(LOCALE_PREFERENCE_STORAGE_KEY)).toBe("en");
    expect(readLocalePreference(storage)).toBe("en");
  });

  it("switches the runtime language and writes the browser preference", async () => {
    const storage = createStorage();
    vi.stubGlobal("window", { localStorage: storage });

    await setLocale("en");

    expect(i18n.resolvedLanguage).toBe("en");
    expect(storage.getItem(LOCALE_PREFERENCE_STORAGE_KEY)).toBe("en");
  });
});
