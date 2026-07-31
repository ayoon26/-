import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { product } from "@/config/product";
import { useAppStore } from "@/lib/store";

const LINKS = [
  { to: "/profile/notifications", label: "Notifications", icon: "🔔" },
  { to: "/profile/institutions", label: "Connected institutions", icon: "🏦" },
  { to: "/profile/privacy", label: "Privacy & data controls", icon: "🔒" },
  { to: "/profile/preferences", label: "Recommendation preferences", icon: "🎛️" },
  { to: "/profile/demo-reset", label: "Reset demo data", icon: "🔄" },
];

export function Profile() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const mode = useAppStore((s) => s.mode);

  return (
    <div className="pt-4">
      <PageHeader title="Profile" />
      <Card className="flex items-center gap-3">
        <div aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-sprout-100 text-xl">
          {user?.displayName?.[0]?.toUpperCase() ?? "🙂"}
        </div>
        <div>
          <p className="font-medium text-ink">{user?.displayName ?? "Guest"}</p>
          <p className="text-sm text-ink-soft">{user?.email ?? "Not signed in"}</p>
          <p className="mt-0.5 text-xs text-ink-faint">{mode === "demo" ? "Demo Mode" : mode === "connected" ? "Connected Mode" : "Not started"}</p>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-2.5">
        {LINKS.map((link) => (
          <button key={link.to} onClick={() => navigate(link.to)} className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3.5 text-left shadow-card">
            <span className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </span>
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint">
        {product.name} · v0.1.0 (MVP)
      </p>
      <Disclaimer className="mt-2 text-center" />
    </div>
  );
}
