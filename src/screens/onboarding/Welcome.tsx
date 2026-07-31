import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { product } from "@/config/product";
import { useAppStore } from "@/lib/store";

export function Welcome() {
  const navigate = useNavigate();
  const startOnboarding = useAppStore((s) => s.startOnboarding);
  const user = useAppStore((s) => s.user);

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col justify-between px-6 py-10">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div aria-hidden="true" className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-sprout-100 text-4xl">
          🌱
        </div>
        <h1 className="text-2xl font-semibold leading-snug text-ink">Make one smarter money move at a time.</h1>
        <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-soft">
          Connect your accounts or explore with sample data. {product.name} finds small opportunities to save,
          stabilize, and grow.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => {
            startOnboarding();
            navigate("/onboarding/goals");
          }}
        >
          Explore with sample data
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            startOnboarding();
            navigate("/onboarding/goals?connect=1");
          }}
        >
          Connect my accounts
        </Button>
        {user ? (
          <Button variant="ghost" onClick={() => navigate("/today")}>
            Continue as {user.displayName}
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => navigate("/sign-in")}>
            Sign in
          </Button>
        )}
        <Disclaimer className="pt-2 text-center" />
      </div>
    </div>
  );
}
