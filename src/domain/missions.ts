import type { Cents } from "./money";
import type { ID } from "./types";
import { nowISO, addDaysISO, type ISODateString } from "./dates";
import type { EffortLevel, InsightCandidate, InsightType } from "./insights/types";

export type MissionType = "save" | "review" | "protect" | "learn";
export type MissionStatus = "suggested" | "accepted" | "snoozed" | "dismissed" | "completed";

export interface Mission {
  id: ID;
  insightId: ID;
  category: InsightType;
  title: string;
  description: string;
  reason: string;
  missionType: MissionType;
  targetAmountCents?: Cents;
  effortLevel: EffortLevel;
  status: MissionStatus;
  createdAt: ISODateString;
  acceptedAt?: ISODateString;
  completedAt?: ISODateString;
  snoozedUntil?: ISODateString;
  dismissalReason?: string;
}

const MISSION_TYPE_BY_INSIGHT: Record<InsightType, MissionType> = {
  subscription_review: "review",
  price_increase: "review",
  duplicate_charge: "protect",
  avoidable_fee: "protect",
  spending_change: "learn",
  cash_flow_risk: "review",
  savings_opportunity: "save",
  debt_paydown: "save",
  idle_cash: "learn",
  goal_progress: "save",
  positive_progress: "learn",
};

export function missionTypeForInsight(type: InsightType): MissionType {
  return MISSION_TYPE_BY_INSIGHT[type];
}

export function createMissionFromInsight(insight: InsightCandidate): Mission {
  return {
    id: `mission:${insight.id}`,
    insightId: insight.id,
    category: insight.type,
    title: insight.title,
    description: insight.explanation,
    reason: insight.explanation,
    missionType: missionTypeForInsight(insight.type),
    targetAmountCents: insight.type === "savings_opportunity" || insight.type === "debt_paydown" ? insight.estimatedImpactCents : undefined,
    effortLevel: insight.effortLevel,
    status: "suggested",
    createdAt: nowISO(),
  };
}

export function acceptMission(mission: Mission): Mission {
  return { ...mission, status: "accepted", acceptedAt: nowISO() };
}

export function modifyMissionAmount(mission: Mission, newAmountCents: Cents): Mission {
  return { ...mission, targetAmountCents: Math.max(0, Math.trunc(newAmountCents)) };
}

export function snoozeMission(mission: Mission, days = 7): Mission {
  return { ...mission, status: "snoozed", snoozedUntil: addDaysISO(new Date().toISOString().slice(0, 10), days) };
}

export function dismissMission(mission: Mission, reason?: string): Mission {
  return { ...mission, status: "dismissed", dismissalReason: reason };
}

export function completeMission(mission: Mission): Mission {
  return { ...mission, status: "completed", completedAt: nowISO() };
}
