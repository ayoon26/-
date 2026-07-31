import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { StaleDataNotice } from "@/components/ui/States";
import { calculateNetPosition } from "@/domain/netPosition";
import { spendingInWindow, topCategories, discretionaryVsNecessary } from "@/domain/spending";
import { isStaleSync, relativeTime, toISODate } from "@/domain/dates";
import type { Account, AccountType } from "@/domain/types";
import { useAppStore } from "@/lib/store";

const GROUP_LABEL: Record<AccountType, string> = { cash: "Cash", credit: "Credit", investment: "Investments", loan: "Loans" };
const GROUP_ORDER: AccountType[] = ["cash", "credit", "investment", "loan"];

function AccountRow({ account }: { account: Account }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/money/accounts/${account.id}`)}
      className="flex w-full items-center justify-between gap-3 border-b border-line py-3 text-left last:border-0"
    >
      <div>
        <p className="text-[15px] font-medium text-ink">{account.name}</p>
        <p className="text-xs text-ink-faint">•••• {account.mask}</p>
        {isStaleSync(account.lastSyncedAt) && <StaleDataNotice label={`Last updated ${relativeTime(account.lastSyncedAt)}`} />}
      </div>
      <span className="font-medium tabular-nums text-ink">
        <AmountDisplay cents={account.currentBalanceCents} />
      </span>
    </button>
  );
}

export function MoneyOverview() {
  const navigate = useNavigate();
  const allAccounts = useAppStore((s) => s.accounts);
  const accounts = allAccounts.filter((a) => !a.isHidden);
  const transactions = useAppStore((s) => s.transactions);
  const net = calculateNetPosition(accounts);
  const today = toISODate(new Date());

  const currentMonthSpend = spendingInWindow(transactions, today, 30, 0);
  const previousMonthSpend = spendingInWindow(transactions, today, 60, 30);
  const categories = topCategories(transactions, today, 30, 4);
  const { discretionaryCents, necessaryCents } = discretionaryVsNecessary(transactions, today, 30);

  return (
    <div className="pt-4">
      <PageHeader title="Money" subtitle="Your complete financial picture" />

      <Card>
        <p className="text-sm text-ink-soft">Net position</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
          <AmountDisplay cents={net.netPositionCents} />
        </p>
        <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-ink-soft">Cash</span>
          <span className="text-right tabular-nums text-ink">
            <AmountDisplay cents={net.cashCents} />
          </span>
          <span className="text-ink-soft">Credit balance</span>
          <span className="text-right tabular-nums text-ink">
            <AmountDisplay cents={net.creditBalanceCents} />
          </span>
          <span className="text-ink-soft">Investments</span>
          <span className="text-right tabular-nums text-ink">
            <AmountDisplay cents={net.investmentsCents} />
          </span>
          <span className="text-ink-soft">Loans</span>
          <span className="text-right tabular-nums text-ink">
            <AmountDisplay cents={net.loansCents} />
          </span>
        </div>
      </Card>

      <div className="mt-5">
        {GROUP_ORDER.map((type) => {
          const group = accounts.filter((a) => a.type === type);
          if (group.length === 0) return null;
          return (
            <div key={type} className="mb-4">
              <p className="mb-1 text-sm font-medium text-ink-soft">{GROUP_LABEL[type]}</p>
              <Card className="divide-y divide-line py-0">
                {group.map((a) => (
                  <AccountRow key={a.id} account={a} />
                ))}
              </Card>
            </div>
          );
        })}
      </div>

      <Card className="mt-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Spending this month</p>
          <button onClick={() => navigate("/money/transactions")} className="text-sm text-sky underline-offset-2 hover:underline">
            See all transactions
          </button>
        </div>
        <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
          <AmountDisplay cents={currentMonthSpend} />
        </p>
        <p className="text-xs text-ink-faint">
          <AmountDisplay cents={previousMonthSpend} /> last month
        </p>
        <div className="mt-3 flex flex-col gap-1.5">
          {categories.map((c) => (
            <div key={c.category} className="flex items-center justify-between text-sm">
              <span className="capitalize text-ink-soft">{c.category.replace(/_/g, " ")}</span>
              <span className="tabular-nums text-ink">
                <AmountDisplay cents={c.totalCents} />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-ink-faint">
          <span>
            Necessary: <AmountDisplay cents={necessaryCents} />
          </span>
          <span>
            Discretionary: <AmountDisplay cents={discretionaryCents} />
          </span>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-2.5">
        <button onClick={() => navigate("/money/recurring")} className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3.5 text-left shadow-card">
          <span className="text-[15px] font-medium text-ink">Recurring payments</span>
          <span aria-hidden="true">→</span>
        </button>
        <button onClick={() => navigate("/money/cashflow")} className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3.5 text-left shadow-card">
          <span className="text-[15px] font-medium text-ink">Cash-flow projection</span>
          <span aria-hidden="true">→</span>
        </button>
        <button onClick={() => navigate("/goals")} className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3.5 text-left shadow-card">
          <span className="text-[15px] font-medium text-ink">Goals</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
