import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { EmptyState, StaleDataNotice } from "@/components/ui/States";
import { isStaleSync, relativeTime } from "@/domain/dates";
import { displayAmountCents } from "@/domain/types";
import { useAppStore } from "@/lib/store";

export function AccountDetail() {
  const { accountId } = useParams<{ accountId: string }>();
  const account = useAppStore((s) => s.accounts.find((a) => a.id === accountId));
  const institution = useAppStore((s) => s.institutions.find((i) => i.id === account?.institutionId));
  const allTransactions = useAppStore((s) => s.transactions);
  const transactions = allTransactions.filter((t) => t.accountId === accountId);
  const toggleAccountHidden = useAppStore((s) => s.toggleAccountHidden);

  if (!account) {
    return (
      <div className="pt-4">
        <PageHeader title="Account" back />
        <EmptyState title="We couldn't find that account." />
      </div>
    );
  }

  return (
    <div className="pt-4">
      <PageHeader title={account.name} subtitle={institution?.name} back />
      <Card>
        <p className="text-xs text-ink-faint">•••• {account.mask}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
          <AmountDisplay cents={account.currentBalanceCents} />
        </p>
        {account.availableBalanceCents !== undefined && account.availableBalanceCents !== account.currentBalanceCents && (
          <p className="text-sm text-ink-soft">
            Available: <AmountDisplay cents={account.availableBalanceCents} />
          </p>
        )}
        {account.limitCents !== undefined && (
          <p className="text-sm text-ink-soft">
            Limit: <AmountDisplay cents={account.limitCents} />
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {isStaleSync(account.lastSyncedAt) ? (
            <StaleDataNotice label={`Last synced ${relativeTime(account.lastSyncedAt)}`} />
          ) : (
            <p className="text-xs text-ink-faint">Synced {relativeTime(account.lastSyncedAt)}</p>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              institution?.status === "connected" ? "bg-sprout-100 text-sprout-700" : "bg-alert/10 text-alert"
            }`}
          >
            {institution?.status === "connected" ? "Connected" : institution?.status ?? "Unknown"}
          </span>
        </div>
      </Card>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-ink-soft">Recent activity</p>
        {transactions.length === 0 ? (
          <EmptyState title="No transactions yet for this account." />
        ) : (
          <Card className="divide-y divide-line py-0">
            {transactions.slice(0, 15).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[15px] text-ink">{t.userMerchantName ?? t.merchantName}</p>
                  <p className="text-xs text-ink-faint">{t.transactionDate}</p>
                </div>
                <span className="tabular-nums text-ink">
                  <AmountDisplay cents={displayAmountCents(t)} />
                </span>
              </div>
            ))}
          </Card>
        )}
      </div>

      <Button variant="ghost" className="mt-4" onClick={() => toggleAccountHidden(account.id)}>
        {account.isHidden ? "Show this account in totals" : "Hide this account from totals"}
      </Button>
    </div>
  );
}
