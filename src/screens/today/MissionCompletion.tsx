import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { centsToDollars, dollarsToCents, formatCents } from "@/domain/money";
import { missionAmountSchema, type MissionAmountFormValues } from "@/lib/validation";
import { useAppStore } from "@/lib/store";

export function MissionCompletion() {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const missions = useAppStore((s) => s.missions);
  const modifyMission = useAppStore((s) => s.modifyMission);
  const snoozeMissionAction = useAppStore((s) => s.snoozeMissionAction);
  const dismissMissionAction = useAppStore((s) => s.dismissMissionAction);
  const completeMissionAction = useAppStore((s) => s.completeMissionAction);
  const [justCompleted, setJustCompleted] = useState(false);
  const [dismissReason, setDismissReason] = useState("");
  const [showDismissField, setShowDismissField] = useState(false);

  const mission = missions.find((m) => m.id === decodeURIComponent(missionId ?? ""));

  const { register, handleSubmit } = useForm<MissionAmountFormValues>({
    resolver: zodResolver(missionAmountSchema),
    values: { amount: mission?.targetAmountCents ? centsToDollars(mission.targetAmountCents) : 0 },
  });

  if (!mission) {
    return (
      <div className="pt-4">
        <PageHeader title="Mission" back />
        <EmptyState title="We couldn't find that mission." description="It may have already been completed or dismissed." />
      </div>
    );
  }

  if (justCompleted || mission.status === "completed") {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-4 text-center">
        <div aria-hidden="true" className="mb-4 text-5xl">
          🌿
        </div>
        <h1 className="text-xl font-semibold text-ink">Nice work.</h1>
        <p className="mt-1.5 max-w-xs text-[15px] text-ink-soft">That's one meaningful decision added to your Money Momentum this week.</p>
        <Button className="mt-6" onClick={() => navigate("/today")}>
          Done
        </Button>
      </div>
    );
  }

  const onSubmitAmount = handleSubmit((values) => {
    modifyMission(mission.id, dollarsToCents(values.amount));
  });

  return (
    <div className="pt-4">
      <PageHeader title="Mission" back />
      <Card>
        <h1 className="text-lg font-semibold text-ink">{mission.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{mission.reason}</p>

        {mission.targetAmountCents !== undefined && (
          <form onSubmit={onSubmitAmount} className="mt-4 flex items-end gap-2">
            <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-ink">
              Amount
              <span className="flex items-center gap-1 rounded-xl border border-line px-3 py-2">
                <span aria-hidden="true">$</span>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className="w-full outline-none"
                  {...register("amount")}
                  aria-label="Mission amount in dollars"
                />
              </span>
            </label>
            <Button type="submit" variant="secondary" size="sm">
              Update
            </Button>
          </form>
        )}
        {mission.targetAmountCents !== undefined && (
          <p className="mt-1 text-xs text-ink-faint">Currently set to {formatCents(mission.targetAmountCents)}. You can adjust this before completing.</p>
        )}
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          onClick={() => {
            completeMissionAction(mission.id);
            setJustCompleted(true);
          }}
        >
          Mark complete
        </Button>
        <Button variant="secondary" onClick={() => snoozeMissionAction(mission.id)}>
          Snooze
        </Button>
        {showDismissField ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              placeholder="Optional: tell us why this isn't useful"
              className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-sprout-400"
              rows={2}
            />
            <Button
              variant="danger"
              onClick={() => {
                dismissMissionAction(mission.id, dismissReason || undefined);
                navigate("/today");
              }}
            >
              Confirm dismiss
            </Button>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setShowDismissField(true)}>
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}
