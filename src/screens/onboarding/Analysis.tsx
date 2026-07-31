import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STAGES = [
  "Organizing accounts",
  "Finding recurring payments",
  "Reviewing spending patterns",
  "Checking cash flow",
  "Looking for your first opportunity",
];

const STEP_DURATION_MS = 650;

/**
 * This sequence reflects real, deterministic steps the rules engine runs —
 * it is not an AI "thinking" animation, so copy stays factual throughout.
 */
export function Analysis() {
  const navigate = useNavigate();
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex >= STAGES.length) {
      const timeout = setTimeout(() => navigate("/onboarding/first-opportunity"), 400);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setStageIndex((i) => i + 1), STEP_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [stageIndex, navigate]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col items-center justify-center px-6 py-10">
      <div aria-hidden="true" className="mb-8 h-14 w-14 animate-pulse rounded-2xl bg-sprout-100 text-3xl leading-[3.5rem]">
        <span className="block text-center">🌱</span>
      </div>
      <ul className="w-full max-w-xs" aria-live="polite">
        {STAGES.map((stage, i) => (
          <li key={stage} className="flex items-center gap-3 py-2 text-[15px]">
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                i < stageIndex ? "bg-sprout-500 text-white" : i === stageIndex ? "border-2 border-sprout-400" : "border border-line"
              }`}
            >
              {i < stageIndex ? "✓" : ""}
            </span>
            <span className={i <= stageIndex ? "text-ink" : "text-ink-faint"}>{stage}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
