import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { EffortBadge, ConfidenceBadge, UrgencyBadge } from "@/components/ui/Badge";
import type { InsightCandidate } from "@/domain/insights/types";
import { useAppStore } from "@/lib/store";
import { track } from "@/services/analytics";

const IMPACT_SUFFIX = { one_time: "", monthly: "/month", annual: "/year" } as const;

export function PrimaryActionCard({ insight }: { insight: InsightCandidate }) {
  const navigate = useNavigate();
  const dismissInsight = useAppStore((s) => s.dismissInsight);
  const snoozeInsight = useAppStore((s) => s.snoozeInsight);

  return (
    <Card className="border border-sprout-100" data-testid="primary-action-card" data-insight-type={insight.type}>
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <UrgencyBadge urgency={insight.urgency} />
        <EffortBadge level={insight.effortLevel} />
        <ConfidenceBadge level={insight.confidence} />
      </div>
      <h2 className="text-lg font-semibold leading-snug text-ink">{insight.title}</h2>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{insight.explanation}</p>
      {insight.estimatedImpactCents !== undefined && (
        <p className="mt-3 text-sm font-medium text-sprout-700">
          Potential impact: <AmountDisplay cents={insight.estimatedImpactCents} />
          {IMPACT_SUFFIX[insight.impactPeriod ?? "one_time"]}
        </p>
      )}
      <button
        onClick={() => {
          track({ name: "insight_explanation_opened", insightType: insight.type });
          navigate(`/today/opportunity/${encodeURIComponent(insight.id)}?why=1`);
        }}
        className="mt-2 text-sm font-medium text-sky underline-offset-2 hover:underline"
      >
        Why am I seeing this?
      </button>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => navigate(`/today/opportunity/${encodeURIComponent(insight.id)}`)}>Review</Button>
        <Button variant="secondary" onClick={() => snoozeInsight(insight.id)}>
          Remind me next week
        </Button>
        <Button variant="ghost" onClick={() => dismissInsight(insight.id)}>
          Dismiss
        </Button>
      </div>
    </Card>
  );
}
