import type { Cents } from "../money";
import type { ID } from "../types";
import type { ISODateString } from "../dates";

export type InsightType =
  | "subscription_review"
  | "price_increase"
  | "duplicate_charge"
  | "avoidable_fee"
  | "spending_change"
  | "cash_flow_risk"
  | "savings_opportunity"
  | "debt_paydown"
  | "idle_cash"
  | "goal_progress"
  | "positive_progress";

export type EffortLevel = "low" | "medium" | "high";
export type ConfidenceLevel = "low" | "medium" | "high";
export type ImpactPeriod = "one_time" | "monthly" | "annual";

export interface EvidenceReference {
  label: string;
  detail: string;
  transactionIds?: ID[];
  accountId?: ID;
  recurringStreamId?: ID;
}

export interface InsightCandidate {
  id: ID;
  type: InsightType;
  title: string;
  explanation: string;
  estimatedImpactCents?: Cents;
  impactPeriod?: ImpactPeriod;
  effortLevel: EffortLevel;
  confidence: ConfidenceLevel;
  evidence: EvidenceReference[];
  actionType: string;
  priorityScore: number;
  urgency: "none" | "low" | "high";
  /** Structured, human-checkable calculation trail for "show me the math". */
  calculation: {
    assumptions: string[];
    dataUsed: string[];
    dateRange?: string;
    lastUpdated: ISODateString;
  };
  expiresAt?: ISODateString;
  generatedAt: ISODateString;
}

export type InsightStatus =
  | "new"
  | "surfaced"
  | "accepted"
  | "dismissed"
  | "snoozed"
  | "completed"
  | "expired";

export interface StoredInsight extends InsightCandidate {
  status: InsightStatus;
  dismissedAt?: ISODateString;
  dismissReason?: string;
  snoozedUntil?: ISODateString;
  feedback?: "useful" | "not_useful";
}
