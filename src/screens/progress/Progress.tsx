import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { EmptyState } from "@/components/ui/States";
import { summarizeMomentum, MILESTONES } from "@/domain/progress";
import { goalProgressFraction } from "@/domain/goals";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { toISODate, relativeTime } from "@/domain/dates";
import { product } from "@/config/product";
import { useAppStore } from "@/lib/store";

const EVENT_LABEL: Record<string, string> = {
  mission_completed: "Completed a mission",
  subscription_reviewed: "Reviewed a recurring payment",
  duplicate_reviewed: "Checked a possible duplicate",
  fee_reviewed: "Reviewed a fee",
  fee_avoided: "Avoided a fee",
  savings_added: "Added to savings",
  debt_reduced: "Reduced a balance",
  transaction_corrected: "Corrected a transaction",
  weekly_review_completed: "Completed a weekly review",
  insight_understood: "Understood an insight",
};

export function Progress() {
  const navigate = useNavigate();
  const events = useAppStore((s) => s.progressEvents);
  const goals = useAppStore((s) => s.goals);
  const today = toISODate(new Date());
  const summary = summarizeMomentum(events, today, 7);
  const reachedMilestones = MILESTONES.filter((m) => m.isReached(events));
  const timeline = [...events].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1)).slice(0, 12);

  return (
    <div className="pt-4">
      <PageHeader title="Progress" subtitle={product.momentumName} />

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-ink-faint">Actions this week</p>
          <p className="mt-1 text-xl font-semibold text-ink">{summary.actionsCompleted}</p>
        </Card>
        <Card>
          <p className="text-xs text-ink-faint">Estimated impact</p>
          <p className="mt-1 text-xl font-semibold text-ink">
            <AmountDisplay cents={summary.estimatedSavedCents} />
          </p>
        </Card>
        <Card>
          <p className="text-xs text-ink-faint">Savings added</p>
          <p className="mt-1 text-xl font-semibold text-ink">
            <AmountDisplay cents={summary.savingsContributedCents} />
          </p>
        </Card>
        <Card>
          <p className="text-xs text-ink-faint">Recurring reviewed</p>
          <p className="mt-1 text-xl font-semibold text-ink">{summary.recurringReviewed}</p>
        </Card>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <button onClick={() => navigate("/progress/weekly")} className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3.5 text-left shadow-card">
          <span className="text-[15px] font-medium text-ink">Weekly reflection</span>
          <span aria-hidden="true">→</span>
        </button>
        <button onClick={() => navigate("/progress/garden")} className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3.5 text-left shadow-card">
          <span className="text-[15px] font-medium text-ink">{product.gardenName}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {goals.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-ink-soft">Goal progress</p>
          <div className="flex flex-col gap-2">
            {goals.map((g) => (
              <Card key={g.id} className="flex items-center gap-4">
                <ProgressRing fraction={goalProgressFraction(g)} label={g.name} size={44} />
                <p className="text-[15px] text-ink">{g.name}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-ink-soft">Milestones</p>
        {reachedMilestones.length === 0 ? (
          <EmptyState title="Your first milestone is on the way." description="Complete a mission to unlock it." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {reachedMilestones.map((m) => (
              <span key={m.id} className="rounded-full bg-sun/15 px-3 py-1.5 text-xs font-medium text-sun">
                {m.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-ink-soft">Recent history</p>
        {timeline.length === 0 ? (
          <EmptyState title="Nothing here yet." description="Completed actions will show up in this timeline." />
        ) : (
          <ul className="divide-y divide-line rounded-xl2 bg-surface px-4 shadow-card">
            {timeline.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-ink">{EVENT_LABEL[e.eventType] ?? e.eventType}</span>
                <span className="text-xs text-ink-faint">{relativeTime(e.occurredAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
