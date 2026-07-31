import { describe, expect, it } from "vitest";
import { calculateSafetyBufferCents, maxSafeSavingsTransferCents, projectCashFlow } from "@/domain/cashflow";
import type { Account, RecurringStream } from "@/domain/types";

function cashAccount(balanceCents: number): Account {
  return {
    id: "acc_checking",
    institutionId: "inst_1",
    providerAccountId: "p1",
    name: "Checking",
    officialName: "Checking",
    mask: "1234",
    type: "cash",
    subtype: "checking",
    currency: "USD",
    currentBalanceCents: balanceCents,
    availableBalanceCents: balanceCents,
    isHidden: false,
    lastSyncedAt: new Date().toISOString(),
  };
}

function bill(overrides: Partial<RecurringStream>): RecurringStream {
  return {
    id: "rs_bill",
    merchantName: "Rent",
    type: "bill",
    category: "rent_housing",
    averageAmountCents: 100000,
    lastAmountCents: 100000,
    frequency: "monthly",
    nextExpectedDate: "2026-08-05",
    confidence: "high",
    status: "active",
    essential: true,
    transactionIds: [],
    ...overrides,
  };
}

describe("projectCashFlow", () => {
  it("flags risk when bills exceed cash plus income in the horizon", () => {
    const projection = projectCashFlow({
      cashAccounts: [cashAccount(20000)],
      recurringStreams: [bill({ nextExpectedDate: "2026-08-05", lastAmountCents: 150000 })],
      today: "2026-07-31",
      horizonDays: 14,
    });
    expect(projection.atRisk).toBe(true);
    expect(projection.projectedBalanceCents).toBeLessThan(0);
  });

  it("is not at risk when cash covers upcoming bills", () => {
    const projection = projectCashFlow({
      cashAccounts: [cashAccount(500000)],
      recurringStreams: [bill({ nextExpectedDate: "2026-08-05", lastAmountCents: 100000 })],
      today: "2026-07-31",
      horizonDays: 14,
    });
    expect(projection.atRisk).toBe(false);
  });

  it("excludes bills outside the horizon window", () => {
    const projection = projectCashFlow({
      cashAccounts: [cashAccount(100000)],
      recurringStreams: [bill({ nextExpectedDate: "2026-09-20", lastAmountCents: 100000 })],
      today: "2026-07-31",
      horizonDays: 14,
    });
    expect(projection.upcomingObligations).toHaveLength(0);
  });

  it("includes expected income within the horizon", () => {
    const income = bill({ id: "rs_income", type: "income", nextExpectedDate: "2026-08-02", lastAmountCents: 200000 });
    const projection = projectCashFlow({ cashAccounts: [cashAccount(0)], recurringStreams: [income], today: "2026-07-31", horizonDays: 14 });
    expect(projection.upcomingIncomeCents).toBe(200000);
  });
});

describe("safety buffer and max safe savings transfer", () => {
  it("never suggests an amount that would drop the balance below the buffer", () => {
    const projection = projectCashFlow({
      cashAccounts: [cashAccount(150000)],
      recurringStreams: [bill({ nextExpectedDate: "2026-08-10", lastAmountCents: 50000 })],
      today: "2026-07-31",
      horizonDays: 14,
    });
    const minimumBuffer = 40000;
    const buffer = calculateSafetyBufferCents(projection, minimumBuffer);
    const maxSafe = maxSafeSavingsTransferCents(projection, minimumBuffer);
    expect(projection.currentCashCents - maxSafe).toBeGreaterThanOrEqual(buffer - 1); // allow for obligations already subtracted
    expect(maxSafe).toBeGreaterThanOrEqual(0);
  });

  it("returns zero, never negative, when cash is tight", () => {
    const projection = projectCashFlow({
      cashAccounts: [cashAccount(10000)],
      recurringStreams: [bill({ nextExpectedDate: "2026-08-01", lastAmountCents: 50000 })],
      today: "2026-07-31",
      horizonDays: 14,
    });
    expect(maxSafeSavingsTransferCents(projection, 40000)).toBe(0);
  });

  it("uses the larger of the minimum buffer and upcoming obligations", () => {
    const projection = projectCashFlow({
      cashAccounts: [cashAccount(500000)],
      recurringStreams: [bill({ nextExpectedDate: "2026-08-01", lastAmountCents: 300000 })],
      today: "2026-07-31",
      horizonDays: 14,
    });
    expect(calculateSafetyBufferCents(projection, 40000)).toBe(300000);
  });
});
