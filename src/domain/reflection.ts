import type { Transaction } from "./types";
import { formatCentsWhole } from "./money";
import { toISODate } from "./dates";
import { spendingInWindow, topCategories } from "./spending";
import type { WeeklyMomentumSummary } from "./progress";

/**
 * Builds a short, factual recap sentence from verified numbers only — no
 * invented tone or personality, per the "avoid artificial AI personality"
 * requirement. Every clause traces back to a computed value.
 */
export function buildWeeklyReflection(transactions: Transaction[], summary: WeeklyMomentumSummary, today = toISODate(new Date())): string {
  const clauses: string[] = [];

  const thisWeekDining = spendingInWindow(transactions, today, 7, 0);
  const lastWeekDining = spendingInWindow(transactions, today, 14, 7);
  if (lastWeekDining > 0) {
    const delta = thisWeekDining - lastWeekDining;
    if (delta < -500) clauses.push(`you spent ${formatCentsWhole(Math.abs(delta))} less overall than last week`);
    else if (delta > 500) clauses.push(`overall spending was ${formatCentsWhole(delta)} higher than last week`);
  }

  if (summary.savingsContributedCents > 0) {
    clauses.push(`added ${formatCentsWhole(summary.savingsContributedCents)} to savings`);
  }
  if (summary.debtReducedCents > 0) {
    clauses.push(`put ${formatCentsWhole(summary.debtReducedCents)} toward debt`);
  }
  if (summary.recurringReviewed > 0) {
    clauses.push(`reviewed ${summary.recurringReviewed} recurring ${summary.recurringReviewed === 1 ? "charge" : "charges"}`);
  }

  const top = topCategories(transactions, today, 7, 1)[0];
  if (top) {
    clauses.push(`your top category this week was ${top.category.replace(/_/g, " ")}`);
  }

  if (clauses.length === 0) {
    return "Not enough activity yet this week to summarize — check back after a few more days.";
  }

  const sentence = clauses.slice(0, 3).join(", ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}
