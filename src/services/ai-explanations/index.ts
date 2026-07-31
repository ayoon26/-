import type { InsightCandidate } from "@/domain/insights/types";

/**
 * AI-assisted explanation layer.
 *
 * Per the product spec, AI is only ever allowed to *rewrite* or *summarize*
 * numbers the deterministic rules engine already produced — never to
 * calculate them. This module is the seam where a real LLM call would plug
 * in (e.g. "rewrite `buildPlainLanguageExplanation`'s input using the
 * configured model"); this build ships a template-based implementation so
 * the product works with zero external API keys, and every output is
 * derived only from the insight's own structured fields.
 *
 * Any real implementation MUST continue to pass `insight.calculation`
 * through untouched to the "Show me the math" view — the AI layer explains,
 * it never overrides the number.
 */

export function buildPlainLanguageExplanation(insight: InsightCandidate): string {
  return insight.explanation;
}

export function buildShowMeTheMath(insight: InsightCandidate): {
  dataUsed: string[];
  assumptions: string[];
  dateRange?: string;
  lastUpdated: string;
  confidence: string;
} {
  return {
    dataUsed: insight.calculation.dataUsed,
    assumptions: insight.calculation.assumptions,
    dateRange: insight.calculation.dateRange,
    lastUpdated: insight.calculation.lastUpdated,
    confidence: insight.confidence,
  };
}

const TERM_DEFINITIONS: Record<string, string> = {
  apr: "Annual Percentage Rate — the yearly cost of carrying a balance, including interest.",
  "safety buffer": "A cash cushion we avoid recommending you dip below when suggesting a savings transfer.",
  "recurring stream": "A charge or deposit that repeats on a predictable schedule, like a subscription or paycheck.",
  discretionary: "Spending you have real choice over day-to-day, like dining out or entertainment.",
  confidence: "How sure we are about a finding, based on how much supporting data we have.",
};

export function explainTerm(term: string): string {
  return TERM_DEFINITIONS[term.toLowerCase()] ?? "We don't have a plain-language definition for that term yet.";
}
