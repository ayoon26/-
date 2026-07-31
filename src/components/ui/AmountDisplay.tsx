import { formatCents, maskAmount, type Cents } from "@/domain/money";
import { useAppStore } from "@/lib/store";

export function AmountDisplay({
  cents,
  className,
  showCents = true,
}: {
  cents: Cents;
  className?: string;
  showCents?: boolean;
}) {
  const hidden = useAppStore((s) => s.preferences.hiddenBalances);
  return (
    <span className={className} aria-label={hidden ? "Amount hidden" : formatCents(cents, { showCents })}>
      {hidden ? maskAmount() : formatCents(cents, { showCents })}
    </span>
  );
}
