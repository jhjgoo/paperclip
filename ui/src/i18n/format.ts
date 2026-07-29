import { i18n } from ".";
import { DEFAULT_LOCALE } from "./locales";

function activeLocale() {
  return i18n.resolvedLanguage ?? DEFAULT_LOCALE;
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat(activeLocale(), {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(activeLocale()).format(value);
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat(activeLocale(), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat(activeLocale(), {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatShortDate(value: Date | string) {
  return new Intl.DateTimeFormat(activeLocale(), {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit) {
  return new Intl.RelativeTimeFormat(activeLocale(), { numeric: "auto" }).format(value, unit);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat(activeLocale(), {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDurationUnit(value: number, unit: Intl.NumberFormatOptions["unit"]) {
  return new Intl.NumberFormat(activeLocale(), { style: "unit", unit, unitDisplay: "narrow" }).format(value);
}
