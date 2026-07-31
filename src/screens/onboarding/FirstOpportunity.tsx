import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { useAppStore } from "@/lib/store";
import { useRankedInsights } from "@/hooks/useRankedInsights";
import { track } from "@/services/analytics";

export function FirstOpportunity() {
  const navigate = useNavigate();
  const ranked = useRankedInsights();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const markFirstOpportunitySeen = useAppStore((s) => s.markFirstOpportunitySeen);
  const dismissInsight = useAppStore((s) => s.dismissInsight);
  const snoozeInsight = useAppStore((s) => s.snoozeInsight);
  const submitInsightFeedback = useAppStore((s) => s.submitInsightFeedback);

  const primary = ranked.primary;

  function finish() {
    completeOnboarding();
    markFirstOpportunitySeen();
    navigate("/today");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-6 py-10">
      <h1 className="text-xl font-semibold text-ink">We found one thing worth a look.</h1>
      <div className="mt-6 flex-1">
        {primary ? (
          <div className="rounded-xl2 bg-surface p-5 shadow-card">
            <p className="text-lg font-semibold text-ink">{primary.title}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{primary.explanation}</p>
            {primary.estimatedImpactCents !== undefined && (
              <p className="mt-3 text-sm font-medium text-sprout-700">
                Potential impact: <AmountDisplay cents={primary.estimatedImpactCents} />
                {primary.impactPeriod === "annual" ? "/year" : primary.impactPeriod === "monthly" ? "/month" : ""}
              </p>
            )}
          </div>
        ) : (
          <EmptyState title="Nothing important needs your attention right now." description="Once your data comes in, we'll surface anything worth a look here." />
        )}
      </div>
      {primary && (
        <div className="flex flex-col gap-3 pt-6">
          <Button
            onClick={() => {
              track({ name: "first_insight_viewed", insightType: primary.type });
              completeOnboarding();
              markFirstOpportunitySeen();
              navigate(`/today/opportunity/${encodeURIComponent(primary.id)}`);
            }}
          >
            Review
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              submitInsightFeedback(primary.id, "not_useful");
              dismissInsight(primary.id, "Not useful");
              finish();
            }}
          >
            Not useful
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              snoozeInsight(primary.id);
              finish();
            }}
          >
            Remind me later
          </Button>
        </div>
      )}
      {!primary && (
        <div className="pt-6">
          <Button onClick={finish}>Go to Today</Button>
        </div>
      )}
    </div>
  );
}
