import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/lib/store";

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe("demo mode + insight + mission lifecycle", () => {
  it("loads Maya's seeded accounts and transactions into the store", async () => {
    await useAppStore.getState().startDemoMode();
    const state = useAppStore.getState();
    expect(state.mode).toBe("demo");
    expect(state.accounts.length).toBeGreaterThan(0);
    expect(state.transactions.length).toBeGreaterThan(0);
  });

  it("accepts a mission from an insight and completing it records a progress event", async () => {
    await useAppStore.getState().startDemoMode();
    const ranked = useAppStore.getState().getRankedInsights();
    const target = ranked.all.find((c) => c.type === "subscription_review") ?? ranked.primary;
    expect(target).toBeDefined();

    const mission = useAppStore.getState().acceptMissionFromInsightId(target!.id);
    expect(mission.status).toBe("accepted");

    useAppStore.getState().completeMissionAction(mission.id);
    const state = useAppStore.getState();
    const completedMission = state.missions.find((m) => m.id === mission.id);
    expect(completedMission?.status).toBe("completed");
    expect(state.progressEvents.some((e) => e.eventType === "mission_completed")).toBe(true);
  });

  it("applies a completed savings mission to the linked goal and account balance", async () => {
    await useAppStore.getState().startDemoMode();
    const ranked = useAppStore.getState().getRankedInsights();
    const savingsInsight = ranked.all.find((c) => c.type === "savings_opportunity");
    expect(savingsInsight).toBeDefined();

    const goalBefore = useAppStore.getState().goals.find((g) => g.status === "active")!;
    const balanceBefore = useAppStore.getState().accounts.find((a) => a.id === goalBefore.linkedAccountId)!.currentBalanceCents;

    const mission = useAppStore.getState().acceptMissionFromInsightId(savingsInsight!.id);
    useAppStore.getState().completeMissionAction(mission.id);

    const state = useAppStore.getState();
    const goalAfter = state.goals.find((g) => g.id === goalBefore.id)!;
    const balanceAfter = state.accounts.find((a) => a.id === goalBefore.linkedAccountId)!.currentBalanceCents;

    expect(goalAfter.currentAmountCents).toBeGreaterThan(goalBefore.currentAmountCents);
    expect(balanceAfter).toBeGreaterThan(balanceBefore);
  });

  it("does not re-surface a dismissed insight until the cooldown passes", async () => {
    await useAppStore.getState().startDemoMode();
    const ranked = useAppStore.getState().getRankedInsights();
    const target = ranked.primary!;
    useAppStore.getState().dismissInsight(target.id, "not useful");

    const rankedAfter = useAppStore.getState().getRankedInsights();
    expect(rankedAfter.all.some((c) => c.id === target.id)).toBe(false);
  });
});

describe("transaction correction", () => {
  it("prioritizes a user-corrected category over the original one", async () => {
    await useAppStore.getState().startDemoMode();
    const transaction = useAppStore.getState().transactions[0];
    useAppStore.getState().correctTransactionCategory(transaction.id, "other");
    const updated = useAppStore.getState().transactions.find((t) => t.id === transaction.id);
    expect(updated?.userCategory).toBe("other");
  });
});

describe("deletion flow", () => {
  it("deleteImportedData clears transactions but keeps preferences", async () => {
    await useAppStore.getState().startDemoMode();
    useAppStore.getState().setPrimaryGoals(["build_savings"]);
    useAppStore.getState().deleteImportedData();
    const state = useAppStore.getState();
    expect(state.transactions).toHaveLength(0);
    expect(state.preferences.primaryGoals).toEqual(["build_savings"]);
  });

  it("deleteAccountData clears everything, including the user profile", async () => {
    await useAppStore.getState().startDemoMode();
    useAppStore.getState().deleteAccountData();
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.mode).toBe("none");
    expect(state.accounts).toHaveLength(0);
  });
});
