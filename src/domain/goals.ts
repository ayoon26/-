import type { Goal } from "./types";
import { type Cents } from "./money";
import { daysBetween, type ISODateString } from "./dates";

export function goalProgressFraction(goal: Goal): number {
  if (goal.targetAmountCents <= 0) return 0;
  return Math.min(1, Math.max(0, goal.currentAmountCents / goal.targetAmountCents));
}

export type GoalPace = "ahead" | "on_pace" | "behind" | "no_target_date";

export interface GoalPaceResult {
  pace: GoalPace;
  requiredWeeklyCents?: Cents;
  remainingCents: Cents;
  weeksRemaining?: number;
}

/**
 * Compares the amount still needed against the time remaining to the target
 * date. "on_pace" allows generous tolerance since this is meant to inform,
 * not pressure.
 */
export function calculateGoalPace(goal: Goal, today: ISODateString, recentWeeklyContributionCents: Cents): GoalPaceResult {
  const remainingCents = Math.max(0, goal.targetAmountCents - goal.currentAmountCents);
  if (!goal.targetDate) {
    return { pace: "no_target_date", remainingCents };
  }
  const daysRemaining = Math.max(1, daysBetween(today, goal.targetDate));
  const weeksRemaining = daysRemaining / 7;
  const requiredWeeklyCents = Math.ceil(remainingCents / weeksRemaining);

  let pace: GoalPace = "on_pace";
  if (recentWeeklyContributionCents >= requiredWeeklyCents * 0.9) pace = "ahead";
  else if (recentWeeklyContributionCents < requiredWeeklyCents * 0.5) pace = "behind";

  return { pace, requiredWeeklyCents, remainingCents, weeksRemaining: Math.round(weeksRemaining) };
}

/** Suggests the next single manageable step toward a goal, never overreaching. */
export function nextManageableActionCents(paceResult: GoalPaceResult, maxSafeSavingsCents: Cents): Cents {
  const suggested = paceResult.requiredWeeklyCents ?? 1500;
  return Math.max(0, Math.min(suggested, maxSafeSavingsCents));
}
