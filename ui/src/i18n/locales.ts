import type { Resource } from "i18next";

import { assertValidLocaleMessages } from "./locale-validation";

export const DEFAULT_LOCALE = "zh-CN" as const;
export const supportedLocales = ["zh-CN", "en"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

const localeModules = import.meta.glob("./locales/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

export const localeMessages = Object.fromEntries(
  Object.entries(localeModules).map(([path, messages]) => {
    const locale = path.match(/\/([A-Za-z0-9_-]+)\.json$/)?.[1];
    if (!locale) {
      throw new Error(`Invalid locale file path: ${path}`);
    }
    return [locale, messages];
  }),
);

if (!(DEFAULT_LOCALE in localeMessages)) {
  throw new Error(`Missing default locale messages for ${DEFAULT_LOCALE}`);
}

for (const locale of supportedLocales) {
  const messages = localeMessages[locale];
  if (!messages) {
    throw new Error(`Missing supported locale messages for ${locale}`);
  }
  try {
    assertValidLocaleMessages(messages);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid ${locale} locale messages: ${message}`);
  }
}

export const i18nextResources: Resource = Object.fromEntries(
  supportedLocales.map((locale) => [locale, { translation: localeMessages[locale] }]),
) as Resource;
