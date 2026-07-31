import type { Transaction, TransactionCategory } from "./types";
import { effectiveCategory } from "./types";
import { addCents, type Cents } from "./money";
import { daysBetween, type ISODateString } from "./dates";

export interface CategoryTotal {
  category: TransactionCategory;
  totalCents: Cents;
}

const DISCRETIONARY: ReadonlySet<TransactionCategory> = new Set(["restaurants", "entertainment", "shopping", "gym_wellness"]);
const NECESSARY: ReadonlySet<TransactionCategory> = new Set(["rent_housing", "groceries", "utilities", "transportation"]);

export function spendingInWindow(transactions: Transaction[], today: ISODateString, startDaysAgo: number, endDaysAgo = 0): Cents {
  return addCents(
    ...transactions
      .filter((t) => {
        if (t.isTransfer || t.excludedFromAnalysis || t.amountCents <= 0) return false;
        if (effectiveCategory(t) === "income") return false;
        const age = daysBetween(t.transactionDate, today);
        return age >= endDaysAgo && age < startDaysAgo;
      })
      .map((t) => t.amountCents)
  );
}

export function topCategories(transactions: Transaction[], today: ISODateString, windowDays = 30, limit = 5): CategoryTotal[] {
  const totals = new Map<TransactionCategory, Cents>();
  for (const t of transactions) {
    if (t.isTransfer || t.excludedFromAnalysis || t.amountCents <= 0) continue;
    const category = effectiveCategory(t);
    if (category === "income") continue;
    if (daysBetween(t.transactionDate, today) >= windowDays) continue;
    totals.set(category, addCents(totals.get(category) ?? 0, t.amountCents));
  }
  return Array.from(totals.entries())
    .map(([category, totalCents]) => ({ category, totalCents }))
    .sort((a, b) => b.totalCents - a.totalCents)
    .slice(0, limit);
}

export function discretionaryVsNecessary(transactions: Transaction[], today: ISODateString, windowDays = 30) {
  let discretionaryCents = 0;
  let necessaryCents = 0;
  let otherCents = 0;
  for (const t of transactions) {
    if (t.isTransfer || t.excludedFromAnalysis || t.amountCents <= 0) continue;
    const category = effectiveCategory(t);
    if (category === "income") continue;
    if (daysBetween(t.transactionDate, today) >= windowDays) continue;
    if (DISCRETIONARY.has(category)) discretionaryCents = addCents(discretionaryCents, t.amountCents);
    else if (NECESSARY.has(category)) necessaryCents = addCents(necessaryCents, t.amountCents);
    else otherCents = addCents(otherCents, t.amountCents);
  }
  return { discretionaryCents, necessaryCents, otherCents };
}
