import { afterEach, describe, expect, it } from "vitest";

import { setLocale } from "../i18n";
import { formatCents, formatProjectBudget } from "./utils";

describe("formatCents", () => {
  afterEach(async () => {
    await setLocale("zh-CN");
  });

  it("uses the active interface locale", async () => {
    await setLocale("en");
    expect(formatCents(12345)).toBe(
      new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(123.45),
    );
  });

  it("localizes the monthly budget suffix", async () => {
    const budget = { amountCents: 12345, windowKind: "calendar_month_utc" };

    await setLocale("zh-CN");
    expect(formatProjectBudget(budget)).toContain("/月");
  });
});
