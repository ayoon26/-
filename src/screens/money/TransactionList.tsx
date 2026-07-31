import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { EmptyState } from "@/components/ui/States";
import { displayAmountCents, effectiveCategory, effectiveMerchantName, type TransactionCategory } from "@/domain/types";
import { useAppStore } from "@/lib/store";

const CATEGORY_OPTIONS: (TransactionCategory | "all")[] = [
  "all",
  "restaurants",
  "groceries",
  "subscriptions",
  "transportation",
  "utilities",
  "rent_housing",
  "gym_wellness",
  "fees_interest",
  "shopping",
  "entertainment",
  "income",
  "other",
];

export function TransactionList() {
  const navigate = useNavigate();
  const transactions = useAppStore((s) => s.transactions);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TransactionCategory | "all">("all");

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (category === "all" ? true : effectiveCategory(t) === category))
      .filter((t) => effectiveMerchantName(t).toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (a.transactionDate < b.transactionDate ? 1 : -1));
  }, [transactions, query, category]);

  return (
    <div className="pt-4">
      <PageHeader title="Transactions" back />
      <label className="sr-only" htmlFor="tx-search">
        Search transactions
      </label>
      <input
        id="tx-search"
        type="search"
        placeholder="Search by merchant"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-line px-3 py-2.5 text-[15px] outline-none focus:border-sprout-400"
      />
      <div className="mt-2.5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CATEGORY_OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              category === c ? "bg-sprout-500 text-white" : "bg-surface text-ink-soft shadow-card"
            }`}
          >
            {c.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState title="No transactions match." description="Try a different search or category." />
        ) : (
          <ul className="divide-y divide-line rounded-xl2 bg-surface px-4 shadow-card">
            {filtered.map((t) => (
              <li key={t.id}>
                <button onClick={() => navigate(`/money/transactions/${t.id}`)} className="flex w-full items-center justify-between gap-3 py-3 text-left">
                  <div>
                    <p className="text-[15px] text-ink">{effectiveMerchantName(t)}</p>
                    <p className="text-xs capitalize text-ink-faint">
                      {t.transactionDate} · {effectiveCategory(t).replace(/_/g, " ")}
                      {t.pending && " · Pending"}
                    </p>
                  </div>
                  <span className="tabular-nums text-ink">
                    <AmountDisplay cents={displayAmountCents(t)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
