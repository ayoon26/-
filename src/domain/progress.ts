import type { Cents } from "./money";
import type { ID } from "./types";
import { addCents } from "./money";
import { daysBetween, type ISODateString } from "./dates";

export type ProgressEventType =
  | "mission_completed"
  | "subscription_reviewed"
  | "duplicate_reviewed"
  | "fee_reviewed"
  | "fee_avoided"
  | "savings_added"
  | "debt_reduced"
  | "transaction_corrected"
  | "weekly_review_completed"
  | "insight_understood";

export interface ProgressEvent {
  id: ID;
  missionId?: ID;
  eventType: ProgressEventType;
  amountCents?: Cents;
  metadata?: Record<string, unknown>;
  occurredAt: ISODateString;
}

export interface WeeklyMomentumSummary {
  actionsCompleted: number;
  estimatedSavedCents: Cents;
  savingsContributedCents: Cents;
  debtReducedCents: Cents;
  feesReviewedOrAvoided: number;
  recurringReviewed: number;
  insightsUnderstood: number;
}

/**
 * Money Momentum is a rollup of meaningful completed actions, never a single
 * opaque score. Each field stays legible on its own.
 */
export function summarizeMomentum(events: ProgressEvent[], today: ISODateString, windowDays = 7): WeeklyMomentumSummary {
  const inWindow = events.filter((e) => daysBetween(e.occurredAt, today) < windowDays);

  const savingsContributedCents = addCents(
    ...inWindow.filter((e) => e.eventType === "savings_added").map((e) => e.amountCents ?? 0)
  );
  const debtReducedCents = addCents(
    ...inWindow.filter((e) => e.eventType === "debt_reduced").map((e) => e.amountCents ?? 0)
  );
  const feeAvoidedCents = addCents(
    ...inWindow.filter((e) => e.eventType === "fee_avoided").map((e) => e.amountCents ?? 0)
  );

  return {
    actionsCompleted: inWindow.filter((e) => e.eventType === "mission_completed").length,
    estimatedSavedCents: addCents(savingsContributedCents, debtReducedCents, feeAvoidedCents),
    savingsContributedCents,
    debtReducedCents,
    feesReviewedOrAvoided: inWindow.filter((e) => e.eventType === "fee_reviewed" || e.eventType === "fee_avoided").length,
    recurringReviewed: inWindow.filter((e) => e.eventType === "subscription_reviewed" || e.eventType === "duplicate_reviewed").length,
    insightsUnderstood: inWindow.filter((e) => e.eventType === "insight_understood").length,
  };
}

export interface Milestone {
  id: string;
  label: string;
  isReached: (events: ProgressEvent[]) => boolean;
}

export const MILESTONES: Milestone[] = [
  {
    id: "first_subscription_review",
    label: "First recurring charge reviewed",
    isReached: (events) => events.some((e) => e.eventType === "subscription_reviewed"),
  },
  {
    id: "first_savings_contribution",
    label: "Emergency goal started",
    isReached: (events) => events.some((e) => e.eventType === "savings_added"),
  },
  {
    id: "first_debt_reduction",
    label: "First debt balance reduction",
    isReached: (events) => events.some((e) => e.eventType === "debt_reduced"),
  },
  {
    id: "four_weekly_reviews",
    label: "Four weekly reviews completed",
    isReached: (events) => events.filter((e) => e.eventType === "weekly_review_completed").length >= 4,
  },
  {
    id: "first_fee_avoided",
    label: "First month without an avoidable fee",
    isReached: (events) => events.some((e) => e.eventType === "fee_avoided"),
  },
];
