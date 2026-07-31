import { formatFullDate, toISODate } from "@/domain/dates";
import { calculateNetPosition } from "@/domain/netPosition";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { EmptyState, OfflineBanner } from "@/components/ui/States";
import { PrimaryActionCard } from "@/components/insights/PrimaryActionCard";
import { SecondaryOpportunityCard } from "@/components/insights/SecondaryOpportunityCard";
import { useAppStore } from "@/lib/store";
import { useRankedInsights } from "@/hooks/useRankedInsights";
import { product } from "@/config/product";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Today() {
  const user = useAppStore((s) => s.user);
  const accounts = useAppStore((s) => s.accounts);
  const isOffline = useAppStore((s) => s.isOffline);
  const toggleHiddenBalances = useAppStore((s) => s.toggleHiddenBalances);
  const hiddenBalances = useAppStore((s) => s.preferences.hiddenBalances);
  const ranked = useRankedInsights();
  const net = calculateNetPosition(accounts);

  const attentionCount = (ranked.primary ? 1 : 0) + ranked.secondary.length;
  const contextMessage =
    attentionCount === 0
      ? "Nothing urgent today."
      : attentionCount === 1
        ? "One thing may deserve attention."
        : `${attentionCount} things may deserve attention.`;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-ink-soft">
              {greeting()}
              {user?.displayName ? `, ${user.displayName}` : ""}
            </p>
            <p className="text-xs text-ink-faint">{formatFullDate(toISODate(new Date()))}</p>
          </div>
          <button
            onClick={toggleHiddenBalances}
            aria-pressed={hiddenBalances}
            className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft shadow-card"
          >
            {hiddenBalances ? "Show amounts" : "Hide amounts"}
          </button>
        </div>
        <p className="mt-3 text-2xl font-semibold tabular-nums text-ink">
          <AmountDisplay cents={net.netPositionCents} />
        </p>
        <p className="text-xs text-ink-faint">Financial overview</p>
      </header>

      {isOffline && <OfflineBanner />}

      <p className="text-sm font-medium text-ink-soft">{contextMessage}</p>

      {ranked.primary ? (
        <PrimaryActionCard insight={ranked.primary} />
      ) : (
        <EmptyState title="Nothing important needs your attention right now." description={`Check back tomorrow — ${product.name} looks fresh each day.`} />
      )}

      {ranked.secondary.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {ranked.secondary.map((insight) => (
            <SecondaryOpportunityCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
