import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { EmptyState } from "@/components/ui/States";
import { calculateGoalPace, goalProgressFraction, nextManageableActionCents } from "@/domain/goals";
import { formatCents } from "@/domain/money";
import { addCents } from "@/domain/money";
import { daysBetween, formatFullDate, toISODate } from "@/domain/dates";
import { maxSafeSavingsTransferCents, projectCashFlow } from "@/domain/cashflow";
import { useAppStore } from "@/lib/store";

const PACE_COPY: Record<string, string> = {
  ahead: "You're ahead of pace.",
  on_pace: "You're on track.",
  behind: "You're a bit behind pace — no pressure, small steps still count.",
  no_target_date: "No target date set, so there's no pace to compare against.",
};

export function GoalDetail() {
  const { goalId } = useParams<{ goalId: string }>();
  const goal = useAppStore((s) => s.goals.find((g) => g.id === goalId));
  const transactions = useAppStore((s) => s.transactions);
  const allAccounts = useAppStore((s) => s.accounts);
  const accounts = allAccounts.filter((a) => a.type === "cash");
  const recurringStreams = useAppStore((s) => s.recurringStreams);
  const today = toISODate(new Date());

  if (!goal) {
    return (
      <div className="pt-4">
        <PageHeader title="Goal" back />
        <EmptyState title="We couldn't find that goal." />
      </div>
    );
  }

  const recentContribution = addCents(
    ...transactions
      .filter((t) => t.accountId === goal.linkedAccountId && t.amountCents < 0 && daysBetween(t.transactionDate, today) <= 7)
      .map((t) => Math.abs(t.amountCents))
  );
  const pace = calculateGoalPace(goal, today, recentContribution);
  const projection = projectCashFlow({ cashAccounts: accounts, recurringStreams, today, horizonDays: 14 });
  const maxSafe = maxSafeSavingsTransferCents(projection, 40_000);
  const nextAction = nextManageableActionCents(pace, maxSafe);

  return (
    <div className="pt-4">
      <PageHeader title={goal.name} back />
      <Card className="flex items-center gap-5">
        <ProgressRing fraction={goalProgressFraction(goal)} size={72} label={goal.name} />
        <div>
          <p className="text-lg font-semibold tabular-nums text-ink">
            <AmountDisplay cents={goal.currentAmountCents} />
          </p>
          <p className="text-sm text-ink-soft">of {formatCents(goal.targetAmountCents)}</p>
          {goal.targetDate && <p className="mt-1 text-xs text-ink-faint">Target: {formatFullDate(goal.targetDate)}</p>}
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-sm font-medium text-ink">{PACE_COPY[pace.pace]}</p>
        {pace.requiredWeeklyCents !== undefined && (
          <p className="mt-1 text-sm text-ink-soft">
            Staying on pace suggests about {formatCents(pace.requiredWeeklyCents)} per week.
          </p>
        )}
      </Card>

      {nextAction > 0 && (
        <Card className="mt-4 border border-sprout-100">
          <p className="text-sm font-medium text-ink">Next manageable step</p>
          <p className="mt-1 text-lg font-semibold text-sprout-700">
            <AmountDisplay cents={nextAction} />
          </p>
          <p className="mt-1 text-xs text-ink-faint">Based on your recent cash flow, this shouldn't interfere with upcoming bills.</p>
        </Card>
      )}
    </div>
  );
}
