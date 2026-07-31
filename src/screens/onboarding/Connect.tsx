import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";
import { useAppStore } from "@/lib/store";
import { track } from "@/services/analytics";
import { plaidFinancialDataProvider } from "@/providers/financial-data/plaid-provider";

export function Connect() {
  const navigate = useNavigate();
  const startDemoMode = useAppStore((s) => s.startDemoMode);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  async function handleDemo() {
    await startDemoMode();
    navigate("/onboarding/analysis");
  }

  async function handleConnect() {
    setIsConnecting(true);
    setConnectError(null);
    track({ name: "account_link_started" });
    try {
      await plaidFinancialDataProvider.createLinkToken("demo-user");
    } catch {
      setConnectError(
        "Plaid Sandbox needs a backend token-exchange server, which this static build doesn't include yet. See README.md for the setup steps — for now you can explore everything with sample data."
      );
      track({ name: "account_link_failed", reason: "no_backend_configured" });
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-6 py-10">
      <h1 className="text-xl font-semibold text-ink">Connect an account, or explore first</h1>
      <p className="mt-1 text-sm text-ink-soft">You can always connect real accounts later from Profile.</p>

      <div className="mt-6 flex flex-col gap-3">
        <Button onClick={handleConnect} disabled={isConnecting} variant="secondary">
          {isConnecting ? "Connecting…" : "Connect institution"}
        </Button>
        {connectError && <ErrorState title="Can't connect yet" description={connectError} onRetry={handleConnect} />}
        <Button onClick={handleDemo}>Continue with demo data</Button>
        <Button variant="ghost" onClick={() => navigate("/today")}>
          Skip for now
        </Button>
      </div>
    </div>
  );
}
