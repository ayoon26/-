import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { product } from "@/config/product";
import { useAppStore } from "@/lib/store";

const STAGES = [
  { min: 0, emoji: "🌰", label: "A seed, ready when you are" },
  { min: 1, emoji: "🌱", label: "A first sprout" },
  { min: 3, emoji: "🌿", label: "Growing steadily" },
  { min: 6, emoji: "🪴", label: "A young plant" },
  { min: 10, emoji: "🌳🌿🌼", label: "A full garden" },
];

function stageFor(count: number) {
  return [...STAGES].reverse().find((s) => count >= s.min) ?? STAGES[0];
}

export function FinancialGarden() {
  const gardenEnabled = useAppStore((s) => s.preferences.gardenEnabled);
  const toggleGardenEnabled = useAppStore((s) => s.toggleGardenEnabled);
  const completedCount = useAppStore((s) => s.progressEvents.filter((e) => e.eventType === "mission_completed").length);

  const stage = stageFor(completedCount);

  return (
    <div className="pt-4">
      <PageHeader
        title={product.gardenName}
        back
        action={
          <button
            onClick={toggleGardenEnabled}
            aria-pressed={gardenEnabled}
            className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft shadow-card"
          >
            {gardenEnabled ? "On" : "Off"}
          </button>
        }
      />
      {!gardenEnabled ? (
        <EmptyState title="Your garden is turned off." description="Turn it back on any time — nothing is lost while it's off." />
      ) : (
        <>
          <Card className="flex flex-col items-center gap-3 py-10 text-center">
            <span aria-hidden="true" className="text-6xl">
              {stage.emoji}
            </span>
            <p className="text-[15px] font-medium text-ink">{stage.label}</p>
            <p className="text-sm text-ink-soft">{completedCount} meaningful {completedCount === 1 ? "action" : "actions"} completed</p>
          </Card>
          <p className="mt-4 text-xs leading-relaxed text-ink-faint">
            Your garden grows from completed actions, not your balance or income — there's no way to fall behind, and a quiet day never
            sets it back.
          </p>
        </>
      )}
    </div>
  );
}
