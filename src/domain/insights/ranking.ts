import type { PrimaryGoal, RecommendationPreferences } from "../types";
import { daysBetween, type ISODateString } from "../dates";
import type { ConfidenceLevel, EffortLevel, InsightCandidate, InsightType, StoredInsight } from "./types";

const CONFIDENCE_WEIGHT: Record<ConfidenceLevel, number> = { low: 0.5, medium: 0.8, high: 1 };
const EFFORT_DIVISOR: Record<EffortLevel, number> = { low: 1, medium: 1.6, high: 2.4 };
const URGENCY_WEIGHT: Record<InsightCandidate["urgency"], number> = { none: 1, low: 1.2, high: 2 };

/** Maps each user-selected primary goal to the insight types most relevant to it. */
const GOAL_RELEVANCE: Record<PrimaryGoal, InsightType[]> = {
  stop_leaks: ["subscription_review", "price_increase", "duplicate_charge", "avoidable_fee"],
  build_savings: ["savings_opportunity", "idle_cash", "goal_progress", "positive_progress"],
  understand_spending: ["spending_change", "cash_flow_risk", "positive_progress"],
  reduce_debt: ["debt_paydown"],
  feel_in_control: ["cash_flow_risk", "duplicate_charge", "avoidable_fee"],
  grow_money: ["idle_cash", "savings_opportunity"],
};

export const DISMISS_COOLDOWN_DAYS = 30;

export function isUnderDismissCooldown(dismissedAt: ISODateString, today: ISODateString): boolean {
  return daysBetween(dismissedAt, today) < DISMISS_COOLDOWN_DAYS;
}

function relevanceMultiplier(type: InsightType, goals: PrimaryGoal[]): number {
  if (goals.length === 0) return 1;
  const isRelevant = goals.some((g) => GOAL_RELEVANCE[g]?.includes(type));
  return isRelevant ? 1.5 : 1;
}

/**
 * priorityScore = (impact x confidence x relevance x urgency) / effort
 * Impact defaults to a small positive baseline so zero-dollar insights
 * (e.g. positive reinforcement) can still be ranked, just low.
 */
export function scoreInsight(candidate: InsightCandidate, goals: PrimaryGoal[]): number {
  const impact = Math.max(candidate.estimatedImpactCents ?? 300, 100) / 100;
  const confidence = CONFIDENCE_WEIGHT[candidate.confidence];
  const relevance = relevanceMultiplier(candidate.type, goals);
  const urgency = URGENCY_WEIGHT[candidate.urgency];
  const effort = EFFORT_DIVISOR[candidate.effortLevel];
  return Number(((impact * confidence * relevance * urgency) / effort).toFixed(2));
}

export interface RankingContext {
  primaryGoals: PrimaryGoal[];
  recommendationPreferences: RecommendationPreferences;
  previouslyDismissed: Map<string, ISODateString>;
  today: ISODateString;
}

export interface RankedInsights {
  primary?: InsightCandidate;
  secondary: InsightCandidate[];
  all: InsightCandidate[];
}

/**
 * Applies category preferences, dismissal cooldowns, and the "one primary +
 * up to two secondary, at most one high-urgency" constraints from the spec.
 */
export function rankInsights(candidates: InsightCandidate[], context: RankingContext): RankedInsights {
  const eligible = candidates.filter((c) => {
    if (!context.recommendationPreferences[c.type]) return false;
    const dismissedAt = context.previouslyDismissed.get(c.id);
    if (dismissedAt && isUnderDismissCooldown(dismissedAt, context.today)) return false;
    return true;
  });

  const scored = eligible
    .map((c) => ({ ...c, priorityScore: scoreInsight(c, context.primaryGoals) }))
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const selected: InsightCandidate[] = [];
  let highUrgencyCount = 0;
  for (const candidate of scored) {
    if (selected.length >= 3) break;
    if (candidate.urgency === "high") {
      if (highUrgencyCount >= 1) continue;
      highUrgencyCount += 1;
    }
    selected.push(candidate);
  }

  return {
    primary: selected[0],
    secondary: selected.slice(1, 3),
    all: scored,
  };
}

export function toStoredInsight(candidate: InsightCandidate): StoredInsight {
  return { ...candidate, status: "surfaced" };
}
