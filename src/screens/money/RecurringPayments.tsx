import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { EmptyState } from "@/components/ui/States";
import { formatShortDate } from "@/domain/dates";
import { compareRecurringPrice } from "@/domain/recurring";
import { useAppStore } from "@/lib/store";

const TYPE_LABEL = { subscription: "Subscription", bill: "Bill", income: "Income", membership: "Membership" } as const;

export function RecurringPayments() {
  const allStreams = useAppStore((s) => s.recurringStreams);
  const streams = allStreams.filter((r) => r.status === "active");
  const reviewRecurringStream = useAppStore((s) => s.reviewRecurringStream);
  const ignoreRecurringStream = useAppStore((s) => s.ignoreRecurringStream);

  const sorted = [...streams].sort((a, b) => (a.nextExpectedDate < b.nextExpectedDate ? -1 : 1));

  return (
    <div className="pt-4">
      <PageHeader title="Recurring payments" subtitle="Bills, subscriptions, and income we've noticed" back />
      {sorted.length === 0 ? (
        <EmptyState title="No recurring payments detected yet." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {sorted.map((stream) => {
            const cmp = compareRecurringPrice(stream);
            return (
              <Card key={stream.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-medium text-ink">{stream.merchantName}</p>
                    <p className="text-xs text-ink-faint">
                      {TYPE_LABEL[stream.type]} · {stream.frequency} · Next {formatShortDate(stream.nextExpectedDate)}
                    </p>
                  </div>
                  <span className="tabular-nums font-medium text-ink">
                    <AmountDisplay cents={stream.lastAmountCents} />
                  </span>
                </div>
                {cmp.meaningful && (
                  <p className="mt-2 text-xs font-medium text-clay">
                    Up from <AmountDisplay cents={stream.previousAmountCents ?? stream.averageAmountCents} /> previously
                  </p>
                )}
                {stream.type !== "income" && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => reviewRecurringStream(stream.id)}>
                      Mark reviewed
                    </Button>
                    {!stream.essential && (
                      <Button size="sm" variant="ghost" onClick={() => ignoreRecurringStream(stream.id)}>
                        Not a concern
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
