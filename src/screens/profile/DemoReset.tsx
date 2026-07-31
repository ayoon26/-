import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingBlock } from "@/components/ui/States";
import { useAppStore } from "@/lib/store";

export function DemoReset() {
  const navigate = useNavigate();
  const mode = useAppStore((s) => s.mode);
  const resetDemoData = useAppStore((s) => s.resetDemoData);
  const [isResetting, setIsResetting] = useState(false);

  return (
    <div className="pt-4">
      <PageHeader title="Reset demo data" back />
      <Card>
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Regenerates Maya's six months of sample accounts and transactions from scratch, clearing any missions, dismissals, or
          corrections you've made in Demo Mode. This has no effect if you're in Connected Mode.
        </p>
      </Card>
      {isResetting ? (
        <LoadingBlock label="Regenerating demo data…" />
      ) : (
        <Button
          className="mt-4"
          variant="danger"
          disabled={mode !== "demo"}
          onClick={async () => {
            setIsResetting(true);
            await resetDemoData();
            setIsResetting(false);
            navigate("/today");
          }}
        >
          Reset demo data
        </Button>
      )}
      {mode !== "demo" && <p className="mt-2 text-xs text-ink-faint">You're not currently in Demo Mode.</p>}
    </div>
  );
}
