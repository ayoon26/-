import type { ReactNode } from "react";
import { Button } from "./Button";

export function EmptyState({ icon = "🌱", title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center gap-2 rounded-xl2 border border-dashed border-line bg-surface/60 px-6 py-10 text-center">
      <span aria-hidden="true" className="text-3xl">
        {icon}
      </span>
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="max-w-xs text-sm text-ink-soft">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something didn't load",
  description = "Please try again in a moment.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 rounded-xl2 border border-alert/20 bg-alert/5 px-6 py-8 text-center">
      <span aria-hidden="true" className="text-2xl">
        ⚠️
      </span>
      <p className="font-medium text-ink">{title}</p>
      <p className="max-w-xs text-sm text-ink-soft">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function OfflineBanner() {
  return (
    <div role="status" className="rounded-xl2 bg-ink/5 px-4 py-3 text-sm text-ink-soft">
      You're offline. Showing the last information we saved on this device.
    </div>
  );
}

export function StaleDataNotice({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-ink-faint">
      <span aria-hidden="true">🕓</span> {label}
    </p>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-2 py-10 text-sm text-ink-soft">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-sprout-300 border-t-sprout-600" aria-hidden="true" />
      {label}
    </div>
  );
}
