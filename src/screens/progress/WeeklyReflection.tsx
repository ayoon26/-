import { useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { summarizeMomentum } from "@/domain/progress";
import { buildWeeklyReflection } from "@/domain/reflection";
import { toISODate } from "@/domain/dates";
import { useAppStore } from "@/lib/store";

export function WeeklyReflection() {
  const events = useAppStore((s) => s.progressEvents);
  const transactions = useAppStore((s) => s.transactions);
  const recordWeeklyReviewCompleted = useAppStore((s) => s.recordWeeklyReviewCompleted);
  const today = toISODate(new Date());
  const summary = summarizeMomentum(events, today, 7);
  const narrative = buildWeeklyReflection(transactions, summary, today);

  useEffect(() => {
    recordWeeklyReviewCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-4">
      <PageHeader title="This week in review" back />
      <Card>
        <p className="text-[15px] leading-relaxed text-ink">{narrative}</p>
      </Card>
      <p className="mt-3 text-xs text-ink-faint">Built from your own transaction and mission history — no generic AI summary.</p>
    </div>
  );
}
