import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Account,
  AuditEvent,
  ConsentRecord,
  Goal,
  Institution,
  NotificationPreferences,
  PrimaryGoal,
  RecommendationPreferences,
  RecurringStream,
  Transaction,
  TransactionCategory,
  User,
  UserPreferences,
} from "@/domain/types";
import { toISODate, nowISO } from "@/domain/dates";
import { addCents } from "@/domain/money";
import { generateInsightCandidates } from "@/domain/insights/rules";
import { rankInsights, type RankedInsights } from "@/domain/insights/ranking";
import type { StoredInsight } from "@/domain/insights/types";
import {
  acceptMission,
  completeMission as completeMissionDomain,
  createMissionFromInsight,
  dismissMission as dismissMissionDomain,
  modifyMissionAmount,
  snoozeMission as snoozeMissionDomain,
  type Mission,
} from "@/domain/missions";
import type { ProgressEvent, ProgressEventType } from "@/domain/progress";
import { mockFinancialDataProvider } from "@/providers/financial-data/mock-provider";
import { track } from "@/services/analytics";
import { generateId } from "@/lib/id";

const MINIMUM_SAFETY_BUFFER_CENTS = 40_000;

function defaultRecommendationPreferences(): RecommendationPreferences {
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

function defaultNotificationPreferences(): NotificationPreferences {
  return { dailyAction: true, weeklyReflection: true, billReminders: true, milestones: true };
}

function defaultPreferences(): UserPreferences {
  return {
    primaryGoals: [],
    hiddenBalances: false,
    gardenEnabled: true,
    notificationPreferences: defaultNotificationPreferences(),
    recommendationPreferences: defaultRecommendationPreferences(),
  };
}

export type AppMode = "none" | "demo" | "connected";

interface AppState {
  user: User | null;
  preferences: UserPreferences;
  mode: AppMode;
  institutions: Institution[];
  accounts: Account[];
  transactions: Transaction[];
  recurringStreams: RecurringStream[];
  goals: Goal[];
  storedInsights: Record<string, StoredInsight>;
  missions: Mission[];
  progressEvents: ProgressEvent[];
  consentRecords: ConsentRecord[];
  auditEvents: AuditEvent[];
  isOffline: boolean;
  isSyncing: boolean;
  hasSeenFirstOpportunity: boolean;

  // Onboarding
  startOnboarding: () => void;
  setPrimaryGoals: (goals: PrimaryGoal[]) => void;
  acceptRiskDisclosure: () => void;
  startDemoMode: () => Promise<void>;
  signIn: (email: string, displayName?: string) => void;
  completeOnboarding: () => void;
  markFirstOpportunitySeen: () => void;
  resetDemoData: () => Promise<void>;

  // Preferences
  toggleHiddenBalances: () => void;
  toggleGardenEnabled: () => void;
  updateNotificationPreferences: (partial: Partial<NotificationPreferences>) => void;
  updateRecommendationPreferences: (partial: Partial<RecommendationPreferences>) => void;
  setOffline: (offline: boolean) => void;

  // Transactions
  correctTransactionCategory: (id: string, category: TransactionCategory) => void;
  correctTransactionMerchant: (id: string, merchantName: string) => void;
  markTransactionAsTransfer: (id: string, isTransfer: boolean) => void;
  excludeTransactionFromAnalysis: (id: string, excluded: boolean) => void;
  addTransactionNote: (id: string, note: string) => void;
  reportDuplicateTransaction: (id: string) => void;

  // Recurring
  reviewRecurringStream: (id: string) => void;
  ignoreRecurringStream: (id: string) => void;

  // Insights
  getRankedInsights: () => RankedInsights;
  dismissInsight: (id: string, reason?: string) => void;
  snoozeInsight: (id: string, days?: number) => void;
  submitInsightFeedback: (id: string, feedback: "useful" | "not_useful") => void;
  markInsightSurfaced: (id: string) => void;

  // Missions
  acceptMissionFromInsightId: (insightId: string) => Mission;
  modifyMission: (missionId: string, newAmountCents: number) => void;
  snoozeMissionAction: (missionId: string) => void;
  dismissMissionAction: (missionId: string, reason?: string) => void;
  completeMissionAction: (missionId: string) => void;

  // Accounts
  toggleAccountHidden: (accountId: string) => void;

  // Goals
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;

  // Progress
  addProgressEvent: (eventType: ProgressEventType, amountCents?: number, metadata?: Record<string, unknown>) => void;
  recordWeeklyReviewCompleted: () => void;

  // Privacy / institutions
  disconnectInstitution: (institutionId: string) => void;
  deleteImportedData: () => void;
  deleteAccountData: () => void;
}

function today(): string {
  return toISODate(new Date());
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      preferences: defaultPreferences(),
      mode: "none",
      institutions: [],
      accounts: [],
      transactions: [],
      recurringStreams: [],
      goals: [],
      storedInsights: {},
      missions: [],
      progressEvents: [],
      consentRecords: [],
      auditEvents: [],
      isOffline: false,
      isSyncing: false,
      hasSeenFirstOpportunity: false,

      startOnboarding: () => {
        track({ name: "onboarding_started" });
      },

      setPrimaryGoals: (goals) => {
        set((s) => ({ preferences: { ...s.preferences, primaryGoals: goals } }));
        track({ name: "goal_selected", goals });
      },

      acceptRiskDisclosure: () => {
        const now = nowISO();
        set((s) => ({
          preferences: { ...s.preferences, riskDisclosureAcceptedAt: now },
          consentRecords: [
            ...s.consentRecords,
            { id: generateId("consent"), consentType: "risk_disclosure", version: "1.0", acceptedAt: now },
          ],
        }));
      },

      startDemoMode: async () => {
        set({ isSyncing: true });
        track({ name: "demo_mode_started" });
        const seed = await mockFinancialDataProvider.loadFullDemoSeed();
        const now = nowISO();
        set({
          mode: "demo",
          institutions: seed.institutions,
          accounts: seed.accounts,
          transactions: seed.transactions,
          recurringStreams: seed.recurringStreams,
          goals: seed.goals,
          isSyncing: false,
          user: get().user ?? {
            id: "user_demo",
            email: "maya@example.com",
            displayName: "Maya",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            currency: "USD",
            locale: "en-US",
            onboardingCompleted: false,
            createdAt: now,
            updatedAt: now,
          },
          // Seed one dismissed insight so the "don't repeat for 30 days" rule is visibly true from first load.
          storedInsights: {
            "subscription_review:rs_musicwave": {
              id: "subscription_review:rs_musicwave",
              type: "subscription_review",
              title: "Review your MusicWave subscription",
              explanation: "Already reviewed recently.",
              effortLevel: "low",
              confidence: "medium",
              evidence: [],
              actionType: "review_subscription",
              priorityScore: 0,
              urgency: "none",
              calculation: { assumptions: [], dataUsed: [], lastUpdated: today() },
              generatedAt: today(),
              status: "dismissed",
              dismissedAt: seed.recurringStreams.find((r) => r.id === "rs_musicwave")?.userReviewedAt ?? today(),
              dismissReason: "Already reviewed — keeping it.",
            },
          },
        });
        track({ name: "account_link_completed", institutionCount: seed.institutions.length });
      },

      resetDemoData: async () => {
        await get().startDemoMode();
      },

      signIn: (email, displayName) => {
        const now = nowISO();
        set((s) => ({
          user: {
            id: s.user?.id ?? generateId("user"),
            email,
            displayName: displayName?.trim() || email.split("@")[0],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            currency: "USD",
            locale: "en-US",
            onboardingCompleted: s.user?.onboardingCompleted ?? false,
            createdAt: s.user?.createdAt ?? now,
            updatedAt: now,
          },
        }));
      },

      completeOnboarding: () => {
        set((s) => ({ user: s.user ? { ...s.user, onboardingCompleted: true, updatedAt: nowISO() } : s.user }));
      },

      markFirstOpportunitySeen: () => set({ hasSeenFirstOpportunity: true }),

      toggleHiddenBalances: () =>
        set((s) => ({ preferences: { ...s.preferences, hiddenBalances: !s.preferences.hiddenBalances } })),

      toggleGardenEnabled: () =>
        set((s) => ({ preferences: { ...s.preferences, gardenEnabled: !s.preferences.gardenEnabled } })),

      updateNotificationPreferences: (partial) =>
        set((s) => ({
          preferences: { ...s.preferences, notificationPreferences: { ...s.preferences.notificationPreferences, ...partial } },
        })),

      updateRecommendationPreferences: (partial) =>
        set((s) => ({
          preferences: {
            ...s.preferences,
            recommendationPreferences: { ...s.preferences.recommendationPreferences, ...partial },
          },
        })),

      setOffline: (offline) => set({ isOffline: offline }),

      correctTransactionCategory: (id, category) => {
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, userCategory: category, updatedAt: nowISO() } : t)),
        }));
        track({ name: "transaction_corrected", field: "category" });
      },

      correctTransactionMerchant: (id, merchantName) => {
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, userMerchantName: merchantName, updatedAt: nowISO() } : t)),
        }));
        track({ name: "transaction_corrected", field: "merchant" });
      },

      markTransactionAsTransfer: (id, isTransfer) => {
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, isTransfer, updatedAt: nowISO() } : t)),
        }));
        track({ name: "transaction_corrected", field: "transfer" });
      },

      excludeTransactionFromAnalysis: (id, excluded) => {
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, excludedFromAnalysis: excluded, updatedAt: nowISO() } : t)),
        }));
        track({ name: "transaction_corrected", field: "excluded" });
      },

      addTransactionNote: (id, note) => {
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, note, updatedAt: nowISO() } : t)),
        }));
      },

      reportDuplicateTransaction: (id) => {
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, reportedDuplicate: true, updatedAt: nowISO() } : t)),
        }));
        get().addProgressEvent("duplicate_reviewed");
      },

      reviewRecurringStream: (id) => {
        set((s) => ({
          recurringStreams: s.recurringStreams.map((r) => (r.id === id ? { ...r, userReviewedAt: nowISO() } : r)),
        }));
        get().addProgressEvent("subscription_reviewed");
      },

      ignoreRecurringStream: (id) => {
        set((s) => ({
          recurringStreams: s.recurringStreams.map((r) => (r.id === id ? { ...r, userIgnored: true, userReviewedAt: nowISO() } : r)),
        }));
      },

      getRankedInsights: () => {
        const s = get();
        const candidates = generateInsightCandidates({
          accounts: s.accounts,
          transactions: s.transactions,
          recurringStreams: s.recurringStreams,
          goals: s.goals,
          today: today(),
          minimumBufferCents: MINIMUM_SAFETY_BUFFER_CENTS,
        });
        const previouslyDismissed = new Map<string, string>();
        for (const stored of Object.values(s.storedInsights)) {
          if (stored.status === "dismissed" && stored.dismissedAt) {
            previouslyDismissed.set(stored.id, stored.dismissedAt);
          }
        }
        return rankInsights(candidates, {
          primaryGoals: s.preferences.primaryGoals,
          recommendationPreferences: s.preferences.recommendationPreferences,
          previouslyDismissed,
          today: today(),
        });
      },

      markInsightSurfaced: (id) => {
        const insight = get().getRankedInsights().all.find((c) => c.id === id);
        if (!insight) return;
        set((s) => ({ storedInsights: { ...s.storedInsights, [id]: { ...insight, status: "surfaced" } } }));
      },

      dismissInsight: (id, reason) => {
        const insight = get().getRankedInsights().all.find((c) => c.id === id);
        const base = insight ?? get().storedInsights[id];
        if (!base) return;
        set((s) => ({
          storedInsights: {
            ...s.storedInsights,
            [id]: { ...base, status: "dismissed", dismissedAt: nowISO(), dismissReason: reason },
          },
        }));
      },

      snoozeInsight: (id, days = 7) => {
        const insight = get().getRankedInsights().all.find((c) => c.id === id);
        const base = insight ?? get().storedInsights[id];
        if (!base) return;
        const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        set((s) => ({
          storedInsights: { ...s.storedInsights, [id]: { ...base, status: "snoozed", snoozedUntil: until } },
        }));
      },

      submitInsightFeedback: (id, feedback) => {
        const insight = get().getRankedInsights().all.find((c) => c.id === id);
        const base: StoredInsight | undefined = get().storedInsights[id] ?? (insight ? { ...insight, status: "surfaced" } : undefined);
        if (base) {
          set((s) => ({ storedInsights: { ...s.storedInsights, [id]: { ...base, feedback } } }));
        }
        track({ name: "recommendation_feedback_submitted", insightType: base?.type ?? "unknown", feedback });
      },

      acceptMissionFromInsightId: (insightId) => {
        const insight = get().getRankedInsights().all.find((c) => c.id === insightId);
        if (!insight) throw new Error("Insight not found");
        const mission = acceptMission(createMissionFromInsight(insight));
        set((s) => ({ missions: [...s.missions.filter((m) => m.insightId !== insightId), mission] }));
        set((s) => ({
          storedInsights: { ...s.storedInsights, [insightId]: { ...insight, status: "accepted" } },
        }));
        track({ name: "mission_accepted", missionType: mission.missionType, category: mission.category });
        return mission;
      },

      modifyMission: (missionId, newAmountCents) => {
        set((s) => ({
          missions: s.missions.map((m) => (m.id === missionId ? modifyMissionAmount(m, newAmountCents) : m)),
        }));
        const mission = get().missions.find((m) => m.id === missionId);
        if (mission) track({ name: "mission_modified", missionType: mission.missionType });
      },

      snoozeMissionAction: (missionId) => {
        set((s) => ({ missions: s.missions.map((m) => (m.id === missionId ? snoozeMissionDomain(m) : m)) }));
        const mission = get().missions.find((m) => m.id === missionId);
        if (mission) track({ name: "mission_snoozed", missionType: mission.missionType });
      },

      dismissMissionAction: (missionId, reason) => {
        set((s) => ({ missions: s.missions.map((m) => (m.id === missionId ? dismissMissionDomain(m, reason) : m)) }));
        const mission = get().missions.find((m) => m.id === missionId);
        if (mission) track({ name: "mission_dismissed", missionType: mission.missionType, hasReason: Boolean(reason) });
      },

      completeMissionAction: (missionId) => {
        const mission = get().missions.find((m) => m.id === missionId);
        if (!mission) return;
        const completed = completeMissionDomain(mission);
        set((s) => ({ missions: s.missions.map((m) => (m.id === missionId ? completed : m)) }));

        // Apply the simulated financial effect of completing this mission to demo data,
        // representing the outcome of the real-world action the user just confirmed.
        if (mission.category === "savings_opportunity" && mission.targetAmountCents) {
          const goal = get().goals.find((g) => g.status === "active");
          if (goal) {
            get().updateGoal(goal.id, { currentAmountCents: goal.currentAmountCents + mission.targetAmountCents });
          }
          set((s) => ({
            accounts: s.accounts.map((a) =>
              a.id === goal?.linkedAccountId
                ? { ...a, currentBalanceCents: addCents(a.currentBalanceCents, mission.targetAmountCents ?? 0) }
                : a.type === "cash" && a.subtype === "checking"
                  ? { ...a, currentBalanceCents: addCents(a.currentBalanceCents, -(mission.targetAmountCents ?? 0)) }
                  : a
            ),
          }));
          get().addProgressEvent("savings_added", mission.targetAmountCents);
        } else if (mission.category === "debt_paydown" && mission.targetAmountCents) {
          const evidenceAccountId = get().getRankedInsights().all.find((c) => c.id === mission.insightId)?.evidence[0]?.accountId;
          set((s) => ({
            accounts: s.accounts.map((a) =>
              a.id === evidenceAccountId ? { ...a, currentBalanceCents: Math.max(0, a.currentBalanceCents - (mission.targetAmountCents ?? 0)) } : a
            ),
          }));
          get().addProgressEvent("debt_reduced", mission.targetAmountCents);
        } else if (mission.category === "subscription_review" || mission.category === "price_increase") {
          get().addProgressEvent("subscription_reviewed");
        } else if (mission.category === "duplicate_charge") {
          get().addProgressEvent("duplicate_reviewed");
        } else if (mission.category === "avoidable_fee") {
          const insight = get().getRankedInsights().all.find((c) => c.id === mission.insightId);
          get().addProgressEvent("fee_avoided", insight?.estimatedImpactCents);
        } else {
          get().addProgressEvent("insight_understood");
        }

        get().addProgressEvent("mission_completed");
        set((s) => ({
          storedInsights: s.storedInsights[mission.insightId]
            ? { ...s.storedInsights, [mission.insightId]: { ...s.storedInsights[mission.insightId], status: "completed" } }
            : s.storedInsights,
        }));
        track({ name: "mission_completed", missionType: mission.missionType, category: mission.category });
      },

      toggleAccountHidden: (accountId) =>
        set((s) => ({ accounts: s.accounts.map((a) => (a.id === accountId ? { ...a, isHidden: !a.isHidden } : a)) })),

      addGoal: (goal) => set((s) => ({ goals: [...s.goals, goal] })),

      updateGoal: (id, updates) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: nowISO() } : g)) })),

      addProgressEvent: (eventType, amountCents, metadata) => {
        set((s) => ({
          progressEvents: [
            ...s.progressEvents,
            { id: generateId("evt"), eventType, amountCents, metadata, occurredAt: nowISO() },
          ],
        }));
      },

      recordWeeklyReviewCompleted: () => {
        get().addProgressEvent("weekly_review_completed");
        track({ name: "weekly_review_viewed" });
      },

      disconnectInstitution: (institutionId) => {
        set((s) => ({
          institutions: s.institutions.map((i) => (i.id === institutionId ? { ...i, status: "disconnected" } : i)),
          accounts: s.accounts.map((a) => (a.institutionId === institutionId ? { ...a, isHidden: true } : a)),
          auditEvents: [
            ...s.auditEvents,
            {
              id: generateId("audit"),
              eventType: "institution_disconnected",
              resourceType: "institution",
              resourceId: institutionId,
              createdAt: nowISO(),
            },
          ],
        }));
        track({ name: "institution_disconnected" });
      },

      deleteImportedData: () => {
        set({ transactions: [], recurringStreams: [], storedInsights: {}, missions: [] });
        track({ name: "data_deleted", scope: "transactions" });
      },

      deleteAccountData: () => {
        set({
          user: null,
          preferences: defaultPreferences(),
          mode: "none",
          institutions: [],
          accounts: [],
          transactions: [],
          recurringStreams: [],
          goals: [],
          storedInsights: {},
          missions: [],
          progressEvents: [],
          consentRecords: [],
          auditEvents: [],
          hasSeenFirstOpportunity: false,
        });
        track({ name: "data_deleted", scope: "account" });
      },
    }),
    { name: "sprout-store" }
  )
);
