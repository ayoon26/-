import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/lib/store";
import type { NotificationPreferences } from "@/domain/types";

const OPTIONS: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: "dailyAction", label: "Today's action", description: "A nudge when there's something worth a look." },
  { key: "weeklyReflection", label: "Weekly reflection", description: "A short recap of the week, once a week." },
  { key: "billReminders", label: "Bill reminders", description: "A heads-up before a bill is due." },
  { key: "milestones", label: "Milestones", description: "A note when you reach a meaningful milestone." },
];

export function Notifications() {
  const prefs = useAppStore((s) => s.preferences.notificationPreferences);
  const update = useAppStore((s) => s.updateNotificationPreferences);

  return (
    <div className="pt-4">
      <PageHeader title="Notifications" back />
      <Card className="divide-y divide-line py-0">
        {OPTIONS.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between gap-3 py-3.5">
            <div>
              <p className="text-[15px] font-medium text-ink">{opt.label}</p>
              <p className="text-sm text-ink-soft">{opt.description}</p>
            </div>
            <input
              type="checkbox"
              role="switch"
              aria-checked={prefs[opt.key]}
              checked={prefs[opt.key]}
              onChange={(e) => update({ [opt.key]: e.target.checked })}
              className="h-5 w-9 shrink-0 accent-sprout-500"
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
