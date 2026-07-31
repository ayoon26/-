import { useNavigate } from "react-router-dom";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import type { InsightCandidate } from "@/domain/insights/types";

export function SecondaryOpportunityCard({ insight }: { insight: InsightCandidate }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/today/opportunity/${encodeURIComponent(insight.id)}`)}
      className="flex w-full items-center justify-between gap-3 rounded-xl2 bg-surface px-4 py-3.5 text-left shadow-card"
      data-testid="secondary-opportunity-card"
      data-insight-type={insight.type}
    >
      <div>
        <p className="text-[15px] font-medium text-ink">{insight.title}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">{insight.explanation}</p>
      </div>
      {insight.estimatedImpactCents !== undefined && (
        <span className="shrink-0 text-sm font-medium text-sprout-700">
          <AmountDisplay cents={insight.estimatedImpactCents} />
        </span>
      )}
    </button>
  );
}
