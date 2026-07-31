import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/lib/store";
import type { RecommendationPreferences as Prefs } from "@/domain/types";

const CATEGORY_LABELS: Record<keyof Prefs, string> = {
  subscription_review: "Subscription reviews",
  price_increase: "Price increases",
  duplicate_charge: "Possible duplicates",
  avoidable_fee: "Avoidable fees",
  spending_change: "Spending changes",
  cash_flow_risk: "Cash-flow risk",
  savings_opportunity: "Savings opportunities",
  debt_paydown: "Debt paydown",
  idle_cash: "Idle cash",
  goal_progress: "Goal progress",
  positive_progress: "Positive progress",
};

export function RecommendationPreferences() {
  const prefs = useAppStore((s) => s.preferences.recommendationPreferences);
  const update = useAppStore((s) => s.updateRecommendationPreferences);

  return (
    <div className="pt-4">
      <PageHeader title="Recommendation preferences" subtitle="Choose which categories can surface on Today" back />
      <Card className="divide-y divide-line py-0">
        {(Object.keys(CATEGORY_LABELS) as (keyof Prefs)[]).map((key) => (
          <div key={key} className="flex items-center justify-between gap-3 py-3.5">
            <p className="text-[15px] font-medium text-ink">{CATEGORY_LABELS[key]}</p>
            <input
              type="checkbox"
              role="switch"
              aria-checked={prefs[key]}
              checked={prefs[key]}
              onChange={(e) => update({ [key]: e.target.checked })}
              className="h-5 w-9 shrink-0 accent-sprout-500"
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
