import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState, StaleDataNotice } from "@/components/ui/States";
import { isStaleSync, relativeTime } from "@/domain/dates";
import { useAppStore } from "@/lib/store";

export function ConnectedInstitutions() {
  const institutions = useAppStore((s) => s.institutions);
  const disconnectInstitution = useAppStore((s) => s.disconnectInstitution);

  return (
    <div className="pt-4">
      <PageHeader title="Connected institutions" back />
      {institutions.length === 0 ? (
        <EmptyState title="No institutions connected." description="Connect an account or start Demo Mode from the welcome screen." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {institutions.map((inst) => (
            <Card key={inst.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="text-2xl">
                    {inst.logoEmoji}
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-ink">{inst.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        inst.status === "connected" ? "bg-sprout-100 text-sprout-700" : "bg-alert/10 text-alert"
                      }`}
                    >
                      {inst.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                {inst.status === "connected" && (
                  <Button size="sm" variant="danger" onClick={() => disconnectInstitution(inst.id)}>
                    Disconnect
                  </Button>
                )}
              </div>
              {isStaleSync(inst.lastSyncedAt) ? (
                <StaleDataNotice label={`Last synced ${relativeTime(inst.lastSyncedAt)}`} />
              ) : (
                <p className="mt-2 text-xs text-ink-faint">Last synced {relativeTime(inst.lastSyncedAt)}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
