import clsx from "clsx";
import type { ConfidenceLevel, EffortLevel } from "@/domain/insights/types";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", className)}>
      {children}
    </span>
  );
}

const EFFORT_LABEL: Record<EffortLevel, string> = { low: "Quick — about 2 min", medium: "About 10 min", high: "Takes some time" };
export function EffortBadge({ level }: { level: EffortLevel }) {
  return <Badge className="bg-sky/10 text-sky">{EFFORT_LABEL[level]}</Badge>;
}

const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = { low: "Low confidence", medium: "Medium confidence", high: "High confidence" };
export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return <Badge className="bg-plum/10 text-plum">{CONFIDENCE_LABEL[level]}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: "none" | "low" | "high" }) {
  if (urgency === "none") return null;
  return (
    <Badge className={urgency === "high" ? "bg-clay/15 text-clay" : "bg-sun/15 text-sun"}>
      {urgency === "high" ? "Worth attention soon" : "Worth a look"}
    </Badge>
  );
}
