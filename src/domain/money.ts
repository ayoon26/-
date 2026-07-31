/**
 * All money in this codebase is represented as integer cents.
 * Never use floating-point arithmetic directly on dollar amounts.
 */

import { product } from "@/config/product";

export type Cents = number;

export function dollarsToCents(dollars: number): Cents {
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: Cents): number {
  return cents / 100;
}

export function addCents(...values: Cents[]): Cents {
  return values.reduce((sum, v) => sum + Math.trunc(v), 0);
}

export function subtractCents(a: Cents, b: Cents): Cents {
  return Math.trunc(a) - Math.trunc(b);
}

export function absCents(a: Cents): Cents {
  return Math.abs(Math.trunc(a));
}

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string, currency: string, maximumFractionDigits = 2) {
  const key = `${locale}:${currency}:${maximumFractionDigits}`;
  let formatter = currencyFormatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits,
      minimumFractionDigits: maximumFractionDigits,
    });
    currencyFormatterCache.set(key, formatter);
  }
  return formatter;
}

/** Formats cents as a currency string, e.g. 1299 -> "$12.99". */
export function formatCents(
  cents: Cents,
  options?: { currency?: string; locale?: string; showCents?: boolean }
): string {
  const currency = options?.currency ?? product.currency;
  const locale = options?.locale ?? product.locale;
  const showCents = options?.showCents ?? true;
  return getFormatter(locale, currency, showCents ? 2 : 0).format(centsToDollars(cents));
}

/** Formats cents rounded to the nearest whole dollar, e.g. 1299 -> "$13". */
export function formatCentsWhole(cents: Cents, options?: { currency?: string; locale?: string }): string {
  return formatCents(cents, { ...options, showCents: false });
}

/** Masks a monetary value for the "hide balances" privacy mode. */
export function maskAmount(): string {
  return "•••••";
}

export function percentChange(previous: Cents, current: Cents): number | null {
  if (previous === 0) return null;
  return (current - previous) / Math.abs(previous);
}

export function formatPercent(fraction: number, options?: { maximumFractionDigits?: number }): string {
  return new Intl.NumberFormat(product.locale, {
    style: "percent",
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(fraction);
}

export function clampCents(value: Cents, min: Cents, max: Cents): Cents {
  return Math.min(Math.max(value, min), max);
}
