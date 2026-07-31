import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { EmptyState } from "@/components/ui/States";
import { goalProgressFraction } from "@/domain/goals";
import { dollarsToCents, formatCents } from "@/domain/money";
import { goalFormSchema, type GoalFormValues } from "@/lib/validation";
import { useAppStore } from "@/lib/store";
import { generateId } from "@/lib/id";
import { nowISO } from "@/domain/dates";
import type { GoalType } from "@/domain/types";

const GOAL_TYPES: { value: GoalType; label: string }[] = [
  { value: "emergency_fund", label: "Emergency fund" },
  { value: "travel", label: "Travel" },
  { value: "debt_payoff", label: "Debt payoff" },
  { value: "moving", label: "Moving" },
  { value: "education", label: "Education" },
  { value: "major_purchase", label: "Major purchase" },
  { value: "general_cushion", label: "General cushion" },
];

export function Goals() {
  const navigate = useNavigate();
  const goals = useAppStore((s) => s.goals);
  const addGoal = useAppStore((s) => s.addGoal);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({ resolver: zodResolver(goalFormSchema), defaultValues: { type: "general_cushion" } });

  const onSubmit = handleSubmit((values) => {
    const now = nowISO();
    addGoal({
      id: generateId("goal"),
      name: values.name,
      type: values.type,
      targetAmountCents: dollarsToCents(values.targetAmount),
      currentAmountCents: 0,
      targetDate: values.targetDate || undefined,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
    reset();
    setShowForm(false);
  });

  return (
    <div className="pt-4">
      <PageHeader
        title="Goals"
        action={
          <Button size="sm" variant="secondary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "New goal"}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
            <label className="flex flex-col gap-1 text-sm font-medium text-ink">
              Name
              <input className="rounded-xl border border-line px-3 py-2 text-[15px] outline-none focus:border-sprout-400" {...register("name")} />
              {errors.name && <span className="text-xs text-alert">{errors.name.message}</span>}
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-ink">
              Type
              <select className="rounded-xl border border-line px-3 py-2 text-[15px] outline-none focus:border-sprout-400" {...register("type")}>
                {GOAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-ink">
              Target amount
              <input type="number" step="0.01" className="rounded-xl border border-line px-3 py-2 text-[15px] outline-none focus:border-sprout-400" {...register("targetAmount")} />
              {errors.targetAmount && <span className="text-xs text-alert">{errors.targetAmount.message}</span>}
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-ink">
              Target date (optional)
              <input type="date" className="rounded-xl border border-line px-3 py-2 text-[15px] outline-none focus:border-sprout-400" {...register("targetDate")} />
            </label>
            <Button type="submit" disabled={isSubmitting}>
              Create goal
            </Button>
          </form>
        </Card>
      )}

      {goals.length === 0 ? (
        <EmptyState title="No goals yet." description="Create one to get a pace-aware suggestion for your next contribution." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {goals.map((goal) => (
            <button key={goal.id} onClick={() => navigate(`/goals/${goal.id}`)} className="flex w-full items-center gap-4 rounded-xl2 bg-surface p-4 text-left shadow-card">
              <ProgressRing fraction={goalProgressFraction(goal)} label={goal.name} />
              <div className="flex-1">
                <p className="text-[15px] font-medium text-ink">{goal.name}</p>
                <p className="text-sm text-ink-soft">
                  <AmountDisplay cents={goal.currentAmountCents} /> of {formatCents(goal.targetAmountCents)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
