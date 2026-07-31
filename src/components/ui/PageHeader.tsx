import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function PageHeader({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: boolean; action?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div>
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="mb-1 -ml-1 flex items-center gap-1 rounded-full px-1.5 py-1 text-sm text-ink-soft hover:bg-black/5"
            aria-label="Go back"
          >
            ← Back
          </button>
        )}
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
