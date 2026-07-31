import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { EffortBadge, ConfidenceBadge, UrgencyBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { formatShortDate } from "@/domain/dates";
import { useAppStore } from "@/lib/store";
import { useRankedInsights } from "@/hooks/useRankedInsights";

const IMPACT_SUFFIX = { one_time: "", monthly: "/month", annual: "/year" } as const;

export function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ranked = useRankedInsights();
  const acceptMissionFromInsightId = useAppStore((s) => s.acceptMissionFromInsightId);
  const dismissInsight = useAppStore((s) => s.dismissInsight);
  const snoozeInsight = useAppStore((s) => s.snoozeInsight);
  const [showMath, setShowMath] = useState(params.get("why") === "1");

  const insight = useMemo(() => ranked.all.find((c) => c.id === decodeURIComponent(id ?? "")), [ranked.all, id]);

  if (!insight) {
    return (
      <div className="pt-4">
        <PageHeader title="Opportunity" back />
        <EmptyState title="This opportunity is no longer available." description="It may have already been reviewed, dismissed, or expired." />
      </div>
    );
  }

  return (
    <div className="pt-4">
      <PageHeader title="Opportunity" back />
      <Card>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <UrgencyBadge urgency={insight.urgency} />
          <EffortBadge level={insight.effortLevel} />
          <ConfidenceBadge level={insight.confidence} />
        </div>
        <h1 className="text-xl font-semibold text-ink">{insight.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{insight.explanation}</p>
        {insight.estimatedImpactCents !== undefined && (
          <p className="mt-3 text-sm font-medium text-sprout-700">
            Potential impact: <AmountDisplay cents={insight.estimatedImpactCents} />
            {IMPACT_SUFFIX[insight.impactPeriod ?? "one_time"]}
          </p>
        )}
      </Card>

      <button
        onClick={() => setShowMath((v) => !v)}
        className="mt-4 flex w-full items-center justify-between rounded-xl2 bg-surface px-4 py-3 text-sm font-medium text-ink shadow-card"
        aria-expanded={showMath}
      >
        Show me the math
        <span aria-hidden="true">{showMath ? "−" : "+"}</span>
      </button>
      {showMath && (
        <div className="mt-2 rounded-xl2 bg-ink/5 p-4 text-sm text-ink-soft">
          <p className="font-medium text-ink">Data used</p>
          <ul className="mb-3 mt-1 list-inside list-disc">
            {insight.calculation.dataUsed.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          {insight.calculation.dateRange && (
            <p className="mb-3">
              <span className="font-medium text-ink">Date range:</span> {insight.calculation.dateRange}
            </p>
          )}
          <p className="font-medium text-ink">Assumptions</p>
          <ul className="mb-3 mt-1 list-inside list-disc">
            {insight.calculation.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p className="text-xs text-ink-faint">Last updated {formatShortDate(insight.calculation.lastUpdated)} · Confidence: {insight.confidence}</p>
        </div>
      )}

      {insight.evidence.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-ink">What we looked at</p>
          <div className="flex flex-col gap-2">
            {insight.evidence.map((e, i) => (
              <div key={i} className="rounded-xl2 bg-surface px-4 py-2.5 text-sm shadow-card">
                <p className="font-medium text-ink">{e.label}</p>
                <p className="text-ink-soft">{e.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <Button
          onClick={() => {
            const mission = acceptMissionFromInsightId(insight.id);
            navigate(`/today/mission/${encodeURIComponent(mission.id)}`);
          }}
        >
          {insight.actionType === "acknowledge" ? "Got it" : "Review"}
        </Button>
        <Button variant="secondary" onClick={() => dismissInsight(insight.id, "Keeping it as-is")}>
          Keep it
        </Button>
        <Button variant="ghost" onClick={() => snoozeInsight(insight.id)}>
          Remind me next week
        </Button>
      </div>
    </div>
  );
}
