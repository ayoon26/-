import { describe, expect, it } from "vitest";
import { compareRecurringPrice, isEligibleForPriceIncrease, isEligibleForSubscriptionReview } from "@/domain/recurring";
import type { RecurringStream } from "@/domain/types";

function stream(overrides: Partial<RecurringStream> = {}): RecurringStream {
  return {
    id: "rs_1",
    merchantName: "Streambox",
    type: "subscription",
    category: "subscriptions",
    averageAmountCents: 1299,
    lastAmountCents: 1299,
    previousAmountCents: 1299,
    frequency: "monthly",
    nextExpectedDate: "2026-08-15",
    confidence: "high",
    status: "active",
    essential: false,
    transactionIds: ["t1", "t2", "t3"],
    ...overrides,
  };
}

describe("compareRecurringPrice", () => {
  it("flags a meaningful increase", () => {
    const cmp = compareRecurringPrice(stream({ lastAmountCents: 1499, previousAmountCents: 1299 }));
    expect(cmp.isIncrease).toBe(true);
    expect(cmp.deltaCents).toBe(200);
    expect(cmp.meaningful).toBe(true);
  });

  it("does not flag a trivial sub-threshold increase", () => {
    const cmp = compareRecurringPrice(stream({ lastAmountCents: 1329, previousAmountCents: 1299 }));
    expect(cmp.meaningful).toBe(false);
  });

  it("does not flag a decrease as an increase", () => {
    const cmp = compareRecurringPrice(stream({ lastAmountCents: 999, previousAmountCents: 1299 }));
    expect(cmp.isIncrease).toBe(false);
    expect(cmp.meaningful).toBe(false);
  });
});

describe("isEligibleForSubscriptionReview", () => {
  it("is eligible for a non-essential subscription never reviewed", () => {
    expect(isEligibleForSubscriptionReview(stream(), 60, "2026-07-31")).toBe(true);
  });

  it("is not eligible when marked essential", () => {
    expect(isEligibleForSubscriptionReview(stream({ essential: true }), 60, "2026-07-31")).toBe(false);
  });

  it("is not eligible within the review cooldown window", () => {
    expect(isEligibleForSubscriptionReview(stream({ userReviewedAt: "2026-07-20" }), 60, "2026-07-31")).toBe(false);
  });

  it("is eligible again after the cooldown window passes", () => {
    expect(isEligibleForSubscriptionReview(stream({ userReviewedAt: "2026-05-01" }), 60, "2026-07-31")).toBe(true);
  });

  it("is not eligible with fewer than three charges on record", () => {
    expect(isEligibleForSubscriptionReview(stream({ transactionIds: ["t1"] }), 60, "2026-07-31")).toBe(false);
  });
});

describe("isEligibleForPriceIncrease", () => {
  it("excludes known variable utility merchants even with a large delta", () => {
    const utility = stream({
      merchantName: "City Electric & Water",
      lastAmountCents: 15000,
      previousAmountCents: 8000,
      type: "bill",
    });
    expect(isEligibleForPriceIncrease(utility)).toBe(false);
  });

  it("includes a non-utility merchant with a meaningful increase", () => {
    expect(isEligibleForPriceIncrease(stream({ lastAmountCents: 1499, previousAmountCents: 1299 }))).toBe(true);
  });
});
