import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { product } from "@/config/product";
import { useAppStore } from "@/lib/store";

const POINTS = [
  { icon: "🔍", text: "We ask for account and transaction data so we can find opportunities to save, stabilize, and grow your money." },
  { icon: "🔒", text: `${product.name} cannot move money, cancel a subscription, or trade on your behalf — every action needs your confirmation.` },
  { icon: "🔑", text: "Your bank login is handled by our account-aggregation provider. We never see or store your banking password." },
  { icon: "🔌", text: "You can disconnect any institution at any time from Privacy & Data Controls." },
  { icon: "🗓️", text: "Imported data is kept only as long as your account is active, and you can delete it at any time." },
  { icon: "🎓", text: "Recommendations are educational and informational, not individualized financial advice." },
];

export function Trust() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const acceptRiskDisclosure = useAppStore((s) => s.acceptRiskDisclosure);

  function next() {
    acceptRiskDisclosure();
    const suffix = params.get("connect") ? "?connect=1" : "";
    navigate(`/onboarding/connect${suffix}`);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-6 py-10">
      <h1 className="text-xl font-semibold text-ink">Before you connect anything</h1>
      <ul className="mt-6 flex flex-col gap-4">
        {POINTS.map((p, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="text-xl leading-none">
              {p.icon}
            </span>
            <p className="text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button onClick={next}>I understand, continue</Button>
        <Disclaimer className="text-center" />
      </div>
    </div>
  );
}
