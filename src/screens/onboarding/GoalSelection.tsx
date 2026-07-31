import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import type { PrimaryGoal } from "@/domain/types";

const OPTIONS: { value: PrimaryGoal; label: string }[] = [
  { value: "stop_leaks", label: "Stop losing money to small leaks" },
  { value: "build_savings", label: "Build savings consistently" },
  { value: "understand_spending", label: "Understand where my money goes" },
  { value: "reduce_debt", label: "Reduce debt" },
  { value: "feel_in_control", label: "Feel more in control" },
  { value: "grow_money", label: "Start growing my money" },
];

const MAX_SELECTIONS = 2;

export function GoalSelection() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setPrimaryGoals = useAppStore((s) => s.setPrimaryGoals);
  const [selected, setSelected] = useState<PrimaryGoal[]>([]);

  function toggle(value: PrimaryGoal) {
    setSelected((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= MAX_SELECTIONS) return prev;
      return [...prev, value];
    });
  }

  function next() {
    setPrimaryGoals(selected);
    const suffix = params.get("connect") ? "?connect=1" : "";
    navigate(`/onboarding/trust${suffix}`);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-6 py-10">
      <h1 className="text-xl font-semibold text-ink">What would you most like help with?</h1>
      <p className="mt-1 text-sm text-ink-soft">Pick up to two. This only shapes which opportunities we prioritize.</p>
      <div role="group" aria-label="Financial goals" className="mt-6 flex flex-col gap-2.5">
        {OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(opt.value)}
              className={`rounded-xl2 border px-4 py-3.5 text-left text-[15px] transition-colors ${
                isSelected ? "border-sprout-400 bg-sprout-50 text-sprout-700" : "border-line bg-surface text-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button onClick={next} disabled={selected.length === 0}>
          Continue
        </Button>
        <Button variant="ghost" onClick={next}>
          Skip for now
        </Button>
      </div>
    </div>
  );
}
