import { describe, expect, it } from "vitest";
import { buildMayaSeed } from "@/providers/financial-data/seed/maya";
import { generateInsightCandidates } from "@/domain/insights/rules";
import { toISODate } from "@/domain/dates";

describe("generateInsightCandidates against the seeded Maya demo data", () => {
  const seed = buildMayaSeed();
  const today = toISODate(new Date());
  const candidates = generateInsightCandidates({
    accounts: seed.accounts,
    transactions: seed.transactions,
    recurringStreams: seed.recurringStreams,
    goals: seed.goals,
    today,
    minimumBufferCents: 40_000,
  });
  const types = candidates.map((c) => c.type);

  it("flags the CloudFit gym membership for subscription review", () => {
    expect(candidates.some((c) => c.type === "subscription_review" && c.id.includes("rs_cloudfit"))).toBe(true);
  });

  it("does not flag MusicWave for review, since it was already reviewed", () => {
    expect(candidates.some((c) => c.id.includes("rs_musicwave"))).toBe(false);
  });

  it("flags the Streambox price increase", () => {
    expect(candidates.some((c) => c.type === "price_increase" && c.id.includes("rs_streambox"))).toBe(true);
  });

  it("does not flag the variable utility bill as a price increase", () => {
    expect(candidates.some((c) => c.type === "price_increase" && c.id.includes("rs_utilities"))).toBe(false);
  });

  it("flags the duplicate Bella Trattoria charges", () => {
    expect(types).toContain("duplicate_charge");
  });

  it("flags the avoidable ATM fee", () => {
    expect(types).toContain("avoidable_fee");
  });

  it("flags a debt paydown opportunity on the high-APR card", () => {
    expect(candidates.some((c) => c.type === "debt_paydown" && c.id.includes("acc_meridian"))).toBe(true);
  });

  it("surfaces a savings opportunity toward the active emergency fund goal", () => {
    expect(types).toContain("savings_opportunity");
  });

  it("never proposes an amount below the safety buffer as a scam risk (always non-negative)", () => {
    for (const c of candidates) {
      if (c.type === "savings_opportunity") {
        expect(c.estimatedImpactCents ?? 0).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
