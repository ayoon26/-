import type { Transaction } from "./types";
import { minutesBetween } from "./dates";

export interface DuplicatePair {
  a: Transaction;
  b: Transaction;
  minutesApart: number;
}

const DUPLICATE_WINDOW_MINUTES = 60 * 24; // within a day
const AMOUNT_TOLERANCE_CENTS = 0;

/**
 * Flags pairs of transactions as a *possible* duplicate. This never asserts
 * fraud — only that two charges look similar enough to be worth a human
 * glance, which the insight copy must reflect ("possible duplicate").
 */
export function findPossibleDuplicates(transactions: Transaction[]): DuplicatePair[] {
  const pairs: DuplicatePair[] = [];
  const candidates = transactions.filter((t) => !t.isTransfer && !t.excludedFromAnalysis && t.amountCents > 0);

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const a = candidates[i];
      const b = candidates[j];
      if (a.id === b.id) continue;
      if (a.merchantName !== b.merchantName) continue;
      if (Math.abs(a.amountCents - b.amountCents) > AMOUNT_TOLERANCE_CENTS) continue;

      const bothPostedSameDay = !a.pending && !b.pending;
      const onePendingOnePosted = a.pending !== b.pending;
      if (!bothPostedSameDay && !onePendingOnePosted) continue;

      const anchorA = a.authorizedDate ?? a.transactionDate;
      const anchorB = b.authorizedDate ?? b.transactionDate;
      const minutesApart = minutesBetween(
        `${anchorA}T00:00:00.000Z`,
        `${anchorB}T00:00:00.000Z`
      );
      // For same-day demo data we rely on explicit createdAt timestamps when
      // present to get sub-day precision.
      const preciseMinutes = a.createdAt && b.createdAt ? minutesBetween(a.createdAt, b.createdAt) : minutesApart;

      if (preciseMinutes <= DUPLICATE_WINDOW_MINUTES) {
        pairs.push({ a, b, minutesApart: preciseMinutes });
      }
    }
  }
  return pairs;
}
