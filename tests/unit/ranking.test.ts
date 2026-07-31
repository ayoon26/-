import { describe, expect, it } from "vitest";
import { DISMISS_COOLDOWN_DAYS, isUnderDismissCooldown, rankInsights, scoreInsight } from "@/domain/insights/ranking";
import type { InsightCandidate } from "@/domain/insights/types";
import type { RecommendationPreferences } from "@/domain/types";

function insight(overrides: Partial<InsightCandidate>): InsightCandidate {
  return {
    id: "insight_1",
    type: "subscription_review",
    title: "Review something",
    explanation: "Explanation",
    effortLevel: "low",
    confidence: "medium",
    evidence: [],
    actionType: "review",
    priorityScore: 0,
    urgency: "none",
    calculation: { assumptions: [], dataUsed: [], lastUpdated: "2026-07-31" },
    generatedAt: "2026-07-31",
    ...overrides,
  };
}

function allPreferencesEnabled(): RecommendationPreferences {
  return {
    subscription_review: true,
    price_increase: true,
    duplicate_charge: true,
    avoidable_fee: true,
    spending_change: true,
    cash_flow_risk: true,
    savings_opportunity: true,
    debt_paydown: true,
    idle_cash: true,
    goal_progress: true,
    positive_progress: true,
  };
}

describe("scoreInsight", () => {
  it("scores higher impact above lower impact, all else equal", () => {
    const low = scoreInsight(insight({ estimatedImpactCents: 500 }), []);
    const high = scoreInsight(insight({ estimatedImpactCents: 50000 }), []);
    expect(high).toBeGreaterThan(low);
  });

  it("scores higher confidence above lower confidence", () => {
    const low = scoreInsight(insight({ confidence: "low", estimatedImpactCents: 1000 }), []);
    const high = scoreInsight(insight({ confidence: "high", estimatedImpactCents: 1000 }), []);
    expect(high).toBeGreaterThan(low);
  });

  it("divides by effort, so higher effort scores lower", () => {
    const easy = scoreInsight(insight({ effortLevel: "low", estimatedImpactCents: 1000 }), []);
    const hard = scoreInsight(insight({ effortLevel: "high", estimatedImpactCents: 1000 }), []);
    expect(easy).toBeGreaterThan(hard);
  });

  it("boosts insights relevant to the user's selected goals", () => {
    const irrelevant = scoreInsight(insight({ type: "subscription_review", estimatedImpactCents: 1000 }), ["reduce_debt"]);
    const relevant = scoreInsight(insight({ type: "subscription_review", estimatedImpactCents: 1000 }), ["stop_leaks"]);
    expect(relevant).toBeGreaterThan(irrelevant);
  });
});

describe("isUnderDismissCooldown", () => {
  it("is true immediately after dismissal", () => {
    expect(isUnderDismissCooldown("2026-07-25", "2026-07-31")).toBe(true);
  });

  it("is false once the cooldown window has elapsed", () => {
    expect(isUnderDismissCooldown("2026-05-01", "2026-07-31")).toBe(false);
  });

  it(`respects the documented ${DISMISS_COOLDOWN_DAYS}-day window`, () => {
    expect(isUnderDismissCooldown("2026-07-02", "2026-07-31")).toBe(true); // 29 days
    expect(isUnderDismissCooldown("2026-07-01", "2026-07-31")).toBe(false); // 30 days
  });
});

describe("rankInsights", () => {
  it("excludes insights dismissed within the cooldown window", () => {
    const candidates = [insight({ id: "a" })];
    const result = rankInsights(candidates, {
      primaryGoals: [],
      recommendationPreferences: allPreferencesEnabled(),
      previouslyDismissed: new Map([["a", "2026-07-25"]]),
      today: "2026-07-31",
    });
    expect(result.primary).toBeUndefined();
  });

  it("re-surfaces insights dismissed outside the cooldown window", () => {
    const candidates = [insight({ id: "a" })];
    const result = rankInsights(candidates, {
      primaryGoals: [],
      recommendationPreferences: allPreferencesEnabled(),
      previouslyDismissed: new Map([["a", "2026-05-01"]]),
      today: "2026-07-31",
    });
    expect(result.primary?.id).toBe("a");
  });

  it("respects category preferences", () => {
    const candidates = [insight({ id: "a", type: "idle_cash" })];
    const prefs = { ...allPreferencesEnabled(), idle_cash: false };
    const result = rankInsights(candidates, { primaryGoals: [], recommendationPreferences: prefs, previouslyDismissed: new Map(), today: "2026-07-31" });
    expect(result.primary).toBeUndefined();
  });

  it("allows at most one high-urgency insight in the selection", () => {
    const candidates = [
      insight({ id: "a", urgency: "high", estimatedImpactCents: 50000 }),
      insight({ id: "b", urgency: "high", estimatedImpactCents: 40000 }),
      insight({ id: "c", urgency: "none", estimatedImpactCents: 30000 }),
    ];
    const result = rankInsights(candidates, { primaryGoals: [], recommendationPreferences: allPreferencesEnabled(), previouslyDismissed: new Map(), today: "2026-07-31" });
    const selected = [result.primary, ...result.secondary].filter(Boolean);
    const highUrgencyCount = selected.filter((i) => i!.urgency === "high").length;
    expect(highUrgencyCount).toBe(1);
  });

  it("returns at most one primary and two secondary insights", () => {
    const candidates = Array.from({ length: 6 }, (_, i) => insight({ id: `insight_${i}`, estimatedImpactCents: 1000 * (i + 1) }));
    const result = rankInsights(candidates, { primaryGoals: [], recommendationPreferences: allPreferencesEnabled(), previouslyDismissed: new Map(), today: "2026-07-31" });
    expect(result.secondary.length).toBeLessThanOrEqual(2);
  });
});
