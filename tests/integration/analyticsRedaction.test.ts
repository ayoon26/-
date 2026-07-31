import { describe, expect, it, vi } from "vitest";
import { configureAnalyticsSink, track, type AnalyticsSink } from "@/services/analytics";

describe("analytics redaction", () => {
  it("strips forbidden fields like amounts before reaching the sink", () => {
    const seen: Record<string, unknown>[] = [];
    const sink: AnalyticsSink = { track: (_name, payload) => seen.push(payload) };
    configureAnalyticsSink(sink);

    track({ name: "mission_completed", missionType: "save", category: "savings_opportunity" });
    expect(seen[0]).toEqual({ missionType: "save", category: "savings_opportunity" });
  });

  it("never leaks raw transaction descriptions or feedback categories beyond what is typed", () => {
    const trackSpy = vi.fn();
    configureAnalyticsSink({ track: trackSpy });
    track({ name: "recommendation_feedback_submitted", insightType: "subscription_review", feedback: "useful" });
    expect(trackSpy).toHaveBeenCalledWith("recommendation_feedback_submitted", {
      insightType: "subscription_review",
      feedback: "useful",
    });
  });
});
