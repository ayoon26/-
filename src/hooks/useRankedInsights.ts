import { useMemo } from "react";
import { generateInsightCandidates } from "@/domain/insights/rules";
import { rankInsights, type RankedInsights } from "@/domain/insights/ranking";
import { toISODate } from "@/domain/dates";
import { useAppStore } from "@/lib/store";

const MINIMUM_SAFETY_BUFFER_CENTS = 40_000;

/**
 * `store.getRankedInsights()` recomputes and returns brand-new object/array
 * references on every call. Subscribing to it directly as a Zustand selector
 * (`useAppStore((s) => s.getRankedInsights())`) causes an infinite
 * render loop, since the returned reference never compares equal to itself
 * between renders. This hook selects only the underlying state slices
 * (stable references unless they actually change) and memoizes the
 * derived ranking, which is the safe way to consume it from a component.
 */
export function useRankedInsights(): RankedInsights {
  const accounts = useAppStore((s) => s.accounts);
  const transactions = useAppStore((s) => s.transactions);
  const recurringStreams = useAppStore((s) => s.recurringStreams);
  const goals = useAppStore((s) => s.goals);
  const storedInsights = useAppStore((s) => s.storedInsights);
  const primaryGoals = useAppStore((s) => s.preferences.primaryGoals);
  const recommendationPreferences = useAppStore((s) => s.preferences.recommendationPreferences);

  return useMemo(() => {
    const today = toISODate(new Date());
    const candidates = generateInsightCandidates({
      accounts,
      transactions,
      recurringStreams,
      goals,
      today,
      minimumBufferCents: MINIMUM_SAFETY_BUFFER_CENTS,
    });
    const previouslyDismissed = new Map<string, string>();
    for (const stored of Object.values(storedInsights)) {
      if (stored.status === "dismissed" && stored.dismissedAt) {
        previouslyDismissed.set(stored.id, stored.dismissedAt);
      }
    }
    return rankInsights(candidates, { primaryGoals, recommendationPreferences, previouslyDismissed, today });
  }, [accounts, transactions, recurringStreams, goals, storedInsights, primaryGoals, recommendationPreferences]);
}
