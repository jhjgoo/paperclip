import { afterEach, describe, expect, it } from "vitest";

import { i18n, setLocale } from ".";
import { formatCurrency, formatDate, formatNumber } from "./format";

describe("localized formatters", () => {
  afterEach(async () => {
    await setLocale("zh-CN");
  });

  it("formats currency and numbers with the active locale", async () => {
    await setLocale("zh-CN");
    expect(formatCurrency(12345)).toBe(
      new Intl.NumberFormat("zh-CN", { style: "currency", currency: "USD" }).format(123.45),
    );
    expect(formatNumber(12345.6)).toBe(new Intl.NumberFormat("zh-CN").format(12345.6));

    await setLocale("en");
    expect(formatCurrency(12345)).toBe(
      new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(123.45),
    );
    expect(i18n.resolvedLanguage).toBe("en");
  });

  it("formats dates with the active locale", async () => {
    const value = "2026-07-29T00:00:00.000Z";

    await setLocale("zh-CN");
    expect(formatDate(value)).toBe(
      new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)),
    );
  });
});
