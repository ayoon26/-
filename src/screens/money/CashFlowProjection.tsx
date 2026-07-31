import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { formatShortDate, toISODate } from "@/domain/dates";
import { projectCashFlow } from "@/domain/cashflow";
import { useAppStore } from "@/lib/store";

export function CashFlowProjection() {
  const allAccounts = useAppStore((s) => s.accounts);
  const accounts = allAccounts.filter((a) => a.type === "cash");
  const recurringStreams = useAppStore((s) => s.recurringStreams);
  const projection = projectCashFlow({ cashAccounts: accounts, recurringStreams, today: toISODate(new Date()), horizonDays: 14 });

  return (
    <div className="pt-4">
      <PageHeader title="Cash-flow projection" subtitle="An estimate, not a guarantee" back />
      <Card className={projection.atRisk ? "border border-clay/40" : undefined}>
        <p className="text-sm text-ink-soft">Projected balance in {projection.horizonDays} days</p>
        <p className={`mt-1 text-2xl font-semibold tabular-nums ${projection.atRisk ? "text-clay" : "text-ink"}`}>
          <AmountDisplay cents={projection.projectedBalanceCents} />
        </p>
        {projection.atRisk && <p className="mt-1 text-sm text-clay">This could dip below zero before your next paycheck.</p>}
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-ink-faint">Current cash</p>
          <p className="mt-1 font-medium tabular-nums text-ink">
            <AmountDisplay cents={projection.currentCashCents} />
          </p>
        </Card>
        <Card>
          <p className="text-xs text-ink-faint">Expected income</p>
          <p className="mt-1 font-medium tabular-nums text-ink">
            <AmountDisplay cents={projection.upcomingIncomeCents} />
          </p>
          {projection.nextIncomeDate && <p className="text-xs text-ink-faint">{formatShortDate(projection.nextIncomeDate)}</p>}
        </Card>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-ink-soft">Upcoming obligations included</p>
        {projection.upcomingObligations.length === 0 ? (
          <Card>
            <p className="text-sm text-ink-soft">No bills expected in this window.</p>
          </Card>
        ) : (
          <Card className="divide-y divide-line py-0">
            {projection.upcomingObligations.map((o, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[15px] text-ink">{o.merchantName}</p>
                  <p className="text-xs text-ink-faint">Due {formatShortDate(o.dueDate)}</p>
                </div>
                <span className="tabular-nums text-ink">
                  <AmountDisplay cents={o.amountCents} />
                </span>
              </div>
            ))}
          </Card>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        This projection assumes only recurring bills and income we've detected land on schedule, and uses your available balance
        rather than pending deposits. As of {formatShortDate(projection.asOf)}.
      </p>
    </div>
  );
}
