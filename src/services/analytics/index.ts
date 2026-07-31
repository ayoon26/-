/**
 * Typed analytics wrapper. The event dictionary matches README.md's
 * "Analytics event dictionary" section — add new events in both places.
 *
 * This ships a console-based sink so the product works with zero external
 * services. Swapping in PostHog (or similar) means implementing `AnalyticsSink`
 * and calling `configureAnalyticsSink` once at startup — no call site changes.
 */

export type AnalyticsEvent =
  | { name: "onboarding_started" }
  | { name: "goal_selected"; goals: string[] }
  | { name: "demo_mode_started" }
  | { name: "account_link_started" }
  | { name: "account_link_completed"; institutionCount: number }
  | { name: "account_link_failed"; reason: string }
  | { name: "first_insight_viewed"; insightType: string }
  | { name: "insight_explanation_opened"; insightType: string }
  | { name: "mission_accepted"; missionType: string; category: string }
  | { name: "mission_modified"; missionType: string }
  | { name: "mission_snoozed"; missionType: string }
  | { name: "mission_dismissed"; missionType: string; hasReason: boolean }
  | { name: "mission_completed"; missionType: string; category: string }
  | { name: "transaction_corrected"; field: "category" | "merchant" | "transfer" | "split" | "excluded" }
  | { name: "recommendation_feedback_submitted"; insightType: string; feedback: "useful" | "not_useful" }
  | { name: "weekly_review_viewed" }
  | { name: "institution_disconnected" }
  | { name: "data_deleted"; scope: "transactions" | "account" };

/** Fields that must never leave the client, even inside event payloads. */
const FORBIDDEN_KEYS = new Set([
  "amountCents",
  "amount",
  "balance",
  "balanceCents",
  "description",
  "originalDescription",
  "note",
  "accessToken",
  "accountNumber",
  "mask",
  "income",
]);

function redact<T extends Record<string, unknown>>(payload: T): T {
  const clean = { ...payload };
  for (const key of Object.keys(clean)) {
    if (FORBIDDEN_KEYS.has(key)) delete (clean as Record<string, unknown>)[key];
  }
  return clean;
}

export interface AnalyticsSink {
  track(name: string, payload: Record<string, unknown>): void;
}

class ConsoleAnalyticsSink implements AnalyticsSink {
  track(name: string, payload: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      console.debug("[analytics]", name, payload);
    }
  }
}

let sink: AnalyticsSink = new ConsoleAnalyticsSink();

export function configureAnalyticsSink(newSink: AnalyticsSink) {
  sink = newSink;
}

export function track(event: AnalyticsEvent): void {
  const { name, ...rest } = event;
  sink.track(name, redact(rest));
}
