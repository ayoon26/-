import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { EmptyState } from "@/components/ui/States";
import { displayAmountCents, effectiveCategory, effectiveMerchantName, type TransactionCategory } from "@/domain/types";
import { useAppStore } from "@/lib/store";

const CATEGORIES: TransactionCategory[] = [
  "income",
  "rent_housing",
  "subscriptions",
  "groceries",
  "restaurants",
  "transportation",
  "gym_wellness",
  "utilities",
  "fees_interest",
  "transfer",
  "shopping",
  "entertainment",
  "other",
];

export function TransactionDetail() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const transaction = useAppStore((s) => s.transactions.find((t) => t.id === transactionId));
  const correctTransactionCategory = useAppStore((s) => s.correctTransactionCategory);
  const correctTransactionMerchant = useAppStore((s) => s.correctTransactionMerchant);
  const markTransactionAsTransfer = useAppStore((s) => s.markTransactionAsTransfer);
  const excludeTransactionFromAnalysis = useAppStore((s) => s.excludeTransactionFromAnalysis);
  const addTransactionNote = useAppStore((s) => s.addTransactionNote);
  const reportDuplicateTransaction = useAppStore((s) => s.reportDuplicateTransaction);

  const [merchantDraft, setMerchantDraft] = useState(transaction ? effectiveMerchantName(transaction) : "");
  const [noteDraft, setNoteDraft] = useState(transaction?.note ?? "");

  if (!transaction) {
    return (
      <div className="pt-4">
        <PageHeader title="Transaction" back />
        <EmptyState title="We couldn't find that transaction." />
      </div>
    );
  }

  return (
    <div className="pt-4">
      <PageHeader title="Transaction" back />
      <Card>
        <p className="text-xs text-ink-faint">{transaction.transactionDate}{transaction.pending ? " · Pending" : ""}</p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
          <AmountDisplay cents={displayAmountCents(transaction)} />
        </p>
        <p className="mt-1 text-sm text-ink-soft">{transaction.originalDescription}</p>
        {transaction.reportedDuplicate && (
          <p className="mt-2 rounded-lg bg-clay/10 px-2.5 py-1.5 text-xs font-medium text-clay">Reported as a possible duplicate</p>
        )}
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Merchant
          <div className="flex gap-2">
            <input
              value={merchantDraft}
              onChange={(e) => setMerchantDraft(e.target.value)}
              className="flex-1 rounded-xl border border-line px-3 py-2 text-[15px] outline-none focus:border-sprout-400"
            />
            <Button size="sm" variant="secondary" onClick={() => correctTransactionMerchant(transaction.id, merchantDraft)}>
              Save
            </Button>
          </div>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Category
          <select
            value={effectiveCategory(transaction)}
            onChange={(e) => correctTransactionCategory(transaction.id, e.target.value as TransactionCategory)}
            className="rounded-xl border border-line px-3 py-2 text-[15px] outline-none focus:border-sprout-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between text-sm font-medium text-ink">
          Mark as transfer
          <input
            type="checkbox"
            checked={transaction.isTransfer}
            onChange={(e) => markTransactionAsTransfer(transaction.id, e.target.checked)}
            className="h-5 w-5 accent-sprout-500"
          />
        </label>

        <label className="flex items-center justify-between text-sm font-medium text-ink">
          Exclude from analysis
          <input
            type="checkbox"
            checked={transaction.excludedFromAnalysis}
            onChange={(e) => excludeTransactionFromAnalysis(transaction.id, e.target.checked)}
            className="h-5 w-5 accent-sprout-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Note
          <div className="flex gap-2">
            <input
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              maxLength={280}
              className="flex-1 rounded-xl border border-line px-3 py-2 text-[15px] outline-none focus:border-sprout-400"
            />
            <Button size="sm" variant="secondary" onClick={() => addTransactionNote(transaction.id, noteDraft)}>
              Save
            </Button>
          </div>
        </label>

        {!transaction.reportedDuplicate && (
          <Button variant="ghost" onClick={() => reportDuplicateTransaction(transaction.id)}>
            Report as possible duplicate
          </Button>
        )}
      </div>
    </div>
  );
}
