import { describe, expect, it } from "vitest";
import { calculateGoalPace, goalProgressFraction, nextManageableActionCents } from "@/domain/goals";
import type { Goal } from "@/domain/types";

function goal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: "goal_1",
    name: "Emergency Fund",
    type: "emergency_fund",
    targetAmountCents: 300000,
    currentAmountCents: 60000,
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("goalProgressFraction", () => {
  it("computes a fraction between 0 and 1", () => {
    expect(goalProgressFraction(goal({ currentAmountCents: 150000, targetAmountCents: 300000 }))).toBeCloseTo(0.5);
  });

  it("clamps above the target to 1", () => {
    expect(goalProgressFraction(goal({ currentAmountCents: 400000, targetAmountCents: 300000 }))).toBe(1);
  });

  it("returns 0 for a zero target rather than dividing by zero", () => {
    expect(goalProgressFraction(goal({ targetAmountCents: 0 }))).toBe(0);
  });
});

describe("calculateGoalPace", () => {
  it("reports no_target_date when there is no deadline", () => {
    const result = calculateGoalPace(goal({ targetDate: undefined }), "2026-07-31", 0);
    expect(result.pace).toBe("no_target_date");
  });

  it("reports ahead when recent contributions meet or exceed the required pace", () => {
    const g = goal({ currentAmountCents: 0, targetAmountCents: 10000, targetDate: "2026-08-28" }); // ~4 weeks out, needs ~2500/wk
    const result = calculateGoalPace(g, "2026-07-31", 3000);
    expect(result.pace).toBe("ahead");
  });

  it("reports behind when contributions are well under half the required pace", () => {
    const g = goal({ currentAmountCents: 0, targetAmountCents: 10000, targetDate: "2026-08-28" });
    const result = calculateGoalPace(g, "2026-07-31", 200);
    expect(result.pace).toBe("behind");
  });
});

describe("nextManageableActionCents", () => {
  it("never exceeds the safe savings amount even if more is required", () => {
    const suggestion = nextManageableActionCents({ pace: "behind", requiredWeeklyCents: 20000, remainingCents: 100000 }, 5000);
    expect(suggestion).toBe(5000);
  });

  it("uses the required weekly amount when it is within safe limits", () => {
    const suggestion = nextManageableActionCents({ pace: "on_pace", requiredWeeklyCents: 3000, remainingCents: 100000 }, 5000);
    expect(suggestion).toBe(3000);
  });
});
