import { afterEach, describe, expect, it, vi } from "vitest";

import { LOCALE_PREFERENCE_STORAGE_KEY } from "./locale-preference";

function createStorage(initial: Record<string, string>) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("i18n initialization", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("uses the saved browser locale", async () => {
    vi.stubGlobal(
      "window",
      { localStorage: createStorage({ [LOCALE_PREFERENCE_STORAGE_KEY]: "en" }) },
    );
    vi.resetModules();

    const { i18n } = await import(".");

    expect(i18n.resolvedLanguage).toBe("en");
  });
});
