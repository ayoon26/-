import type { RecurringStream, Transaction } from "./types";
import { absCents, type Cents } from "./money";
import { daysBetween } from "./dates";

/**
 * Compares the latest charge on a recurring stream against its established
 * historical range and reports whether the increase is meaningful enough to
 * flag, rather than ordinary noise.
 */
export interface PriceComparison {
  isIncrease: boolean;
  deltaCents: Cents;
  percentDelta: number;
  meaningful: boolean;
}

const MEANINGFUL_INCREASE_PERCENT = 0.08; // 8%
const MEANINGFUL_INCREASE_MIN_CENTS = 100; // ignore sub-$1 noise

export function compareRecurringPrice(stream: RecurringStream): PriceComparison {
  const baseline = stream.previousAmountCents ?? stream.averageAmountCents;
  const deltaCents = stream.lastAmountCents - baseline;
  const percentDelta = baseline === 0 ? 0 : deltaCents / Math.abs(baseline);
  const isIncrease = deltaCents > 0;
  const meaningful =
    isIncrease &&
    absCents(deltaCents) >= MEANINGFUL_INCREASE_MIN_CENTS &&
    percentDelta >= MEANINGFUL_INCREASE_PERCENT;
  return { isIncrease, deltaCents, percentDelta, meaningful };
}

/** Variable-cost bills that should not trigger a "price increase" insight. */
export const VARIABLE_EXCLUDED_MERCHANTS = new Set([
  "City Electric & Water",
  "State Gas Utility",
]);

export function isEligibleForSubscriptionReview(
  stream: RecurringStream,
  reviewCooldownDays = 60,
  today: string
): boolean {
  if (stream.status !== "active") return false;
  if (stream.type !== "subscription" && stream.type !== "membership") return false;
  if (stream.essential || stream.userIgnored) return false;
  if (stream.transactionIds.length < 3) return false;
  if (!stream.userReviewedAt) return true;
  return daysBetween(stream.userReviewedAt, today) >= reviewCooldownDays;
}

export function isEligibleForPriceIncrease(stream: RecurringStream): boolean {
  if (stream.status !== "active") return false;
  if (VARIABLE_EXCLUDED_MERCHANTS.has(stream.merchantName)) return false;
  return compareRecurringPrice(stream).meaningful;
}

/**
 * Groups transactions into candidate recurring streams by merchant + rough
 * cadence. This is a simplified deterministic detector suitable for demo
 * data; a production system would additionally cluster on amount tolerance
 * bands and normalize merchant name variants server-side.
 */
export function detectRecurringGroups(transactions: Transaction[]): Map<string, Transaction[]> {
  const groups = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (t.isTransfer || t.excludedFromAnalysis) continue;
    if (t.amountCents <= 0) continue; // only outflows recur as bills/subscriptions
    const key = t.merchantName;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  for (const [key, list] of groups) {
    if (list.length < 2) groups.delete(key);
  }
  return groups;
}
