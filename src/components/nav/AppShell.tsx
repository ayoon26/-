import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col bg-canvas">
      <main className="flex-1 px-4 pb-24 pt-[max(1rem,env(safe-area-inset-top))]">{children}</main>
      <BottomNav />
    </div>
  );
}
