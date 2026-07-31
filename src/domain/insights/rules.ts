import type { Account, Goal, RecurringStream, Transaction } from "../types";
import { effectiveCategory, effectiveMerchantName } from "../types";
import { addCents, formatCentsWhole, type Cents } from "../money";
import { daysBetween, type ISODateString } from "../dates";
import { compareRecurringPrice, isEligibleForPriceIncrease, isEligibleForSubscriptionReview } from "../recurring";
import { findPossibleDuplicates } from "../duplicates";
import { calculateSafetyBufferCents, maxSafeSavingsTransferCents, projectCashFlow } from "../cashflow";
import type { InsightCandidate } from "./types";

export interface RulesEngineInput {
  accounts: Account[];
  transactions: Transaction[];
  recurringStreams: RecurringStream[];
  goals: Goal[];
  today: ISODateString;
  minimumBufferCents: Cents;
  /** Amount of prior-period spending for spending-change comparisons, by category. */
  priorPeriodDays?: number;
}

function makeId(type: string, key: string): string {
  return `${type}:${key}`;
}

function sumInWindow(transactions: Transaction[], accountIds: Set<string>, startDaysAgo: number, endDaysAgo: number, today: ISODateString, category?: string): Cents {
  return addCents(
    ...transactions
      .filter((t) => {
        if (!accountIds.has(t.accountId)) return false;
        if (t.isTransfer || t.excludedFromAnalysis || t.amountCents <= 0) return false;
        if (category && effectiveCategory(t) !== category) return false;
        const age = daysBetween(t.transactionDate, today);
        return age >= endDaysAgo && age < startDaysAgo;
      })
      .map((t) => t.amountCents)
  );
}

/** Rule: recurring subscription worth a human review. */
function ruleSubscriptionReview(input: RulesEngineInput): InsightCandidate[] {
  const out: InsightCandidate[] = [];
  for (const stream of input.recurringStreams) {
    if (!isEligibleForSubscriptionReview(stream, 60, input.today)) continue;
    const annualCents = stream.frequency === "monthly" ? stream.averageAmountCents * 12 : stream.averageAmountCents;
    out.push({
      id: makeId("subscription_review", stream.id),
      type: "subscription_review",
      title: `Review your ${stream.merchantName} subscription`,
      explanation: `You were charged ${formatCentsWhole(stream.lastAmountCents)} this month. We haven't found a signal either way about how often you use it — worth a quick look.`,
      estimatedImpactCents: annualCents,
      impactPeriod: "annual",
      effortLevel: "low",
      confidence: "medium",
      evidence: [
        {
          label: "Recurring charges",
          detail: `${stream.transactionIds.length} charges from ${stream.merchantName}`,
          transactionIds: stream.transactionIds,
          recurringStreamId: stream.id,
        },
      ],
      actionType: "review_subscription",
      priorityScore: 0,
      urgency: "none",
      calculation: {
        assumptions: ["Annualized from the most recent monthly charge.", "We can't see whether you actively use the service."],
        dataUsed: [`${stream.merchantName} recurring charge history`],
        lastUpdated: input.today,
      },
      generatedAt: input.today,
    });
  }
  return out;
}

/** Rule: a recurring charge increased meaningfully. */
function rulePriceIncrease(input: RulesEngineInput): InsightCandidate[] {
  const out: InsightCandidate[] = [];
  for (const stream of input.recurringStreams) {
    if (!isEligibleForPriceIncrease(stream)) continue;
    const cmp = compareRecurringPrice(stream);
    out.push({
      id: makeId("price_increase", stream.id),
      type: "price_increase",
      title: `${stream.merchantName} got more expensive`,
      explanation: `Your last charge was ${formatCentsWhole(stream.lastAmountCents)}, up from about ${formatCentsWhole(
        stream.previousAmountCents ?? stream.averageAmountCents
      )}. That's worth a look before it renews again.`,
      estimatedImpactCents: cmp.deltaCents * 12,
      impactPeriod: "annual",
      effortLevel: "low",
      confidence: "high",
      evidence: [
        {
          label: "Price change",
          detail: `${formatCentsWhole(stream.previousAmountCents ?? 0)} → ${formatCentsWhole(stream.lastAmountCents)}`,
          recurringStreamId: stream.id,
          transactionIds: stream.transactionIds,
        },
      ],
      actionType: "review_subscription",
      priorityScore: 0,
      urgency: "low",
      calculation: {
        assumptions: ["Compares your latest charge to your typical recent charge.", "Projected annually at the new price."],
        dataUsed: [`${stream.merchantName} recurring charge history`],
        lastUpdated: input.today,
      },
      generatedAt: input.today,
    });
  }
  return out;
}

/** Rule: possible duplicate charges. */
function ruleDuplicateCharge(input: RulesEngineInput): InsightCandidate[] {
  const pairs = findPossibleDuplicates(input.transactions);
  return pairs.map((pair) => ({
    id: makeId("duplicate_charge", `${pair.a.id}:${pair.b.id}`),
    type: "duplicate_charge",
    title: "We found a possible duplicate",
    explanation: `Two ${formatCentsWhole(pair.a.amountCents)} charges from ${effectiveMerchantName(
      pair.a
    )} appeared about ${Math.max(1, Math.round(pair.minutesApart))} minutes apart. Take a look before assuming it's an error.`,
    estimatedImpactCents: pair.a.amountCents,
    impactPeriod: "one_time",
    effortLevel: "low",
    confidence: "medium",
    evidence: [
      {
        label: "Matching charges",
        detail: `${effectiveMerchantName(pair.a)} — ${formatCentsWhole(pair.a.amountCents)} × 2`,
        transactionIds: [pair.a.id, pair.b.id],
      },
    ],
    actionType: "review_duplicate",
    priorityScore: 0,
    urgency: "low",
    calculation: {
      assumptions: ["Same merchant, same amount, posted close together.", "This is a possible duplicate, not confirmed fraud."],
      dataUsed: ["Recent transaction history"],
      lastUpdated: input.today,
    },
    generatedAt: input.today,
  }));
}

const FEE_CATEGORY = "fees_interest";
const FEE_KEYWORDS = ["overdraft", "late fee", "atm fee", "maintenance fee", "nsf fee"];

/** Rule: avoidable fees (overdraft, late, ATM, maintenance). */
function ruleAvoidableFee(input: RulesEngineInput): InsightCandidate[] {
  const out: InsightCandidate[] = [];
  const recentFees = input.transactions.filter((t) => {
    if (effectiveCategory(t) !== FEE_CATEGORY) return false;
    if (daysBetween(t.transactionDate, input.today) > 45) return false;
    const desc = t.originalDescription.toLowerCase();
    return FEE_KEYWORDS.some((k) => desc.includes(k));
  });
  for (const fee of recentFees) {
    const desc = fee.originalDescription.toLowerCase();
    const kind = FEE_KEYWORDS.find((k) => desc.includes(k)) ?? "fee";
    out.push({
      id: makeId("avoidable_fee", fee.id),
      type: "avoidable_fee",
      title: `An avoidable ${kind.replace(" fee", "")} fee showed up`,
      explanation: `You were charged ${formatCentsWhole(fee.amountCents)} (${fee.originalDescription}). Many of these can be prevented going forward.`,
      estimatedImpactCents: fee.amountCents,
      impactPeriod: "one_time",
      effortLevel: "low",
      confidence: "high",
      evidence: [{ label: "Fee charged", detail: fee.originalDescription, transactionIds: [fee.id] }],
      actionType: "review_fee",
      priorityScore: 0,
      urgency: "low",
      calculation: {
        assumptions: ["Detected from the transaction description.", "Prevention options vary by institution."],
        dataUsed: ["Recent transaction history"],
        lastUpdated: input.today,
      },
      generatedAt: input.today,
    });
  }
  return out;
}

const DISCRETIONARY_CATEGORIES = new Set(["restaurants", "entertainment", "shopping"]);

/** Rule: meaningful spending change vs. the user's own recent history. */
function ruleSpendingChange(input: RulesEngineInput): InsightCandidate[] {
  const out: InsightCandidate[] = [];
  const cashAndCredit = new Set(
    input.accounts.filter((a) => a.type === "cash" || a.type === "credit").map((a) => a.id)
  );
  for (const category of DISCRETIONARY_CATEGORIES) {
    const thisWeek = sumInWindow(input.transactions, cashAndCredit, 7, 0, input.today, category);
    const lastWeek = sumInWindow(input.transactions, cashAndCredit, 14, 7, input.today, category);
    if (lastWeek === 0) continue;
    const deltaCents = thisWeek - lastWeek;
    const percent = deltaCents / lastWeek;
    if (Math.abs(percent) < 0.2 || Math.abs(deltaCents) < 500) continue;
    const improved = deltaCents < 0;
    out.push({
      id: makeId("spending_change", `${category}:${input.today}`),
      type: "spending_change",
      title: improved
        ? `${categoryLabel(category)} spending is down`
        : `${categoryLabel(category)} spending is up this week`,
      explanation: improved
        ? `You spent ${formatCentsWhole(Math.abs(deltaCents))} less on ${categoryLabel(category).toLowerCase()} than last week. Nice shift.`
        : `You spent ${formatCentsWhole(Math.abs(deltaCents))} more on ${categoryLabel(category).toLowerCase()} than last week, compared with your own recent pattern.`,
      estimatedImpactCents: Math.abs(deltaCents),
      impactPeriod: "one_time",
      effortLevel: "low",
      confidence: "medium",
      evidence: [
        {
          label: "Week-over-week comparison",
          detail: `${formatCentsWhole(lastWeek)} last week → ${formatCentsWhole(thisWeek)} this week`,
        },
      ],
      actionType: improved ? "acknowledge" : "review_category",
      priorityScore: 0,
      urgency: "none",
      calculation: {
        assumptions: ["Compared against your own spending from the prior 7 days, not other users."],
        dataUsed: [`${categoryLabel(category)} transactions, last 14 days`],
        dateRange: "Last 14 days",
        lastUpdated: input.today,
      },
      generatedAt: input.today,
    });
  }
  return out;
}

function categoryLabel(category: string): string {
  return category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Rule: upcoming obligations may exceed available cash before next income. */
function ruleCashFlowRisk(input: RulesEngineInput): InsightCandidate[] {
  const cashAccounts = input.accounts.filter((a) => a.type === "cash");
  const projection = projectCashFlow({ cashAccounts, recurringStreams: input.recurringStreams, today: input.today, horizonDays: 14 });
  if (!projection.atRisk) return [];
  return [
    {
      id: makeId("cash_flow_risk", input.today),
      type: "cash_flow_risk",
      title: "Your checking balance may get tight",
      explanation: `Based on bills we expect in the next ${projection.horizonDays} days, your projected balance could dip below zero before your next paycheck.`,
      estimatedImpactCents: Math.abs(projection.projectedBalanceCents),
      impactPeriod: "one_time",
      effortLevel: "medium",
      confidence: "medium",
      evidence: projection.upcomingObligations.map((o) => ({
        label: o.merchantName,
        detail: `${formatCentsWhole(o.amountCents)} due ${o.dueDate}`,
      })),
      actionType: "review_cash_flow",
      priorityScore: 0,
      urgency: "high",
      calculation: {
        assumptions: [
          "Assumes only known recurring bills and income land as scheduled.",
          "Uses available balance, not pending deposits.",
        ],
        dataUsed: ["Cash account balances", "Recurring bills and income"],
        dateRange: `Next ${projection.horizonDays} days`,
        lastUpdated: input.today,
      },
      generatedAt: input.today,
    },
  ];
}

/** Rule: a safe amount is available to move toward a savings goal. */
function ruleSavingsOpportunity(input: RulesEngineInput): InsightCandidate[] {
  const cashAccounts = input.accounts.filter((a) => a.type === "cash");
  const activeGoal = input.goals.find((g) => g.status === "active");
  if (!activeGoal) return [];
  const projection = projectCashFlow({ cashAccounts, recurringStreams: input.recurringStreams, today: input.today, horizonDays: 14 });
  const buffer = calculateSafetyBufferCents(projection, input.minimumBufferCents);
  const maxSafe = maxSafeSavingsTransferCents(projection, input.minimumBufferCents);
  const suggestion = Math.min(maxSafe, 2500);
  if (suggestion < 500) return [];
  return [
    {
      id: makeId("savings_opportunity", `${activeGoal.id}:${input.today}`),
      type: "savings_opportunity",
      title: `Move ${formatCentsWhole(suggestion)} toward ${activeGoal.name}`,
      explanation: `Based on your recent cash flow, this amount appears unlikely to interfere with upcoming bills or your ${formatCentsWhole(
        buffer
      )} safety buffer.`,
      estimatedImpactCents: suggestion,
      impactPeriod: "one_time",
      effortLevel: "low",
      confidence: "medium",
      evidence: [
        { label: "Safety buffer", detail: `Kept at ${formatCentsWhole(buffer)}` },
        { label: "Available cash", detail: formatCentsWhole(projection.currentCashCents) },
      ],
      actionType: "transfer_to_goal",
      priorityScore: 0,
      urgency: "none",
      calculation: {
        assumptions: [
          "Never recommends an amount that would drop your projected balance below the safety buffer.",
          "You can adjust this amount before confirming.",
        ],
        dataUsed: ["Cash balances", "Upcoming bills", `${activeGoal.name} goal`],
        lastUpdated: input.today,
      },
      generatedAt: input.today,
    },
  ];
}

/** Rule: paying extra toward high-interest revolving debt. */
function ruleDebtPaydown(input: RulesEngineInput): InsightCandidate[] {
  const out: InsightCandidate[] = [];
  const highInterestCards = input.accounts.filter(
    (a) => a.type === "credit" && a.currentBalanceCents > 0 && (a.aprBasisPoints ?? 0) >= 1800
  );
  for (const card of highInterestCards) {
    const apr = (card.aprBasisPoints ?? 0) / 10000;
    const extraPayment = Math.min(3500, Math.round(card.currentBalanceCents * 0.05));
    if (extraPayment < 500) continue;
    const roughMonthlyInterestSaved = Math.round((extraPayment * apr) / 12);
    out.push({
      id: makeId("debt_paydown", `${card.id}:${input.today}`),
      type: "debt_paydown",
      title: `Put ${formatCentsWhole(extraPayment)} extra toward ${card.name}`,
      explanation: `This card carries an estimated ${(apr * 100).toFixed(0)}% APR. An extra payment now reduces the balance interest accrues on.`,
      estimatedImpactCents: roughMonthlyInterestSaved,
      impactPeriod: "monthly",
      effortLevel: "medium",
      confidence: "low",
      evidence: [{ label: card.name, detail: `Balance ${formatCentsWhole(card.currentBalanceCents)} at ~${(apr * 100).toFixed(0)}% APR`, accountId: card.id }],
      actionType: "extra_debt_payment",
      priorityScore: 0,
      urgency: "none",
      calculation: {
        assumptions: [
          "This is an estimate, not a guaranteed savings figure.",
          "Assumes the extra payment is applied directly to principal.",
          "You can change the proposed amount.",
        ],
        dataUsed: [`${card.name} balance and APR`],
        lastUpdated: input.today,
      },
      generatedAt: input.today,
    });
  }
  return out;
}

/** Rule: cash sitting idle in a low/no-yield account for months. */
function ruleIdleCash(input: RulesEngineInput): InsightCandidate[] {
  const out: InsightCandidate[] = [];
  for (const account of input.accounts) {
    if (account.subtype !== "savings") continue;
    const recentActivity = input.transactions.some(
      (t) => t.accountId === account.id && daysBetween(t.transactionDate, input.today) <= 120
    );
    if (recentActivity) continue;
    if (account.currentBalanceCents < 50000) continue;
    out.push({
      id: makeId("idle_cash", account.id),
      type: "idle_cash",
      title: `${formatCentsWhole(account.currentBalanceCents)} has been idle in ${account.name}`,
      explanation: "This balance hasn't moved in a while. Worth checking whether it should be working harder for you, such as in a higher-yield account.",
      effortLevel: "medium",
      confidence: "low",
      evidence: [{ label: account.name, detail: "No deposits or withdrawals in the last 4 months", accountId: account.id }],
      actionType: "review_idle_cash",
      priorityScore: 0,
      urgency: "none",
      calculation: {
        assumptions: ["Based on lack of transaction activity, not a judgment about your goals for this money."],
        dataUsed: [`${account.name} transaction history`],
        lastUpdated: input.today,
      },
      generatedAt: input.today,
    });
  }
  return out;
}

/** Rule: recognize positive financial behavior, not just problems. */
function rulePositiveProgress(input: RulesEngineInput): InsightCandidate[] {
  const out: InsightCandidate[] = [];
  const activeGoal = input.goals.find((g) => g.status === "active");
  if (activeGoal) {
    const monthAgo = input.transactions.filter(
      (t) => t.accountId === activeGoal.linkedAccountId && t.amountCents < 0 && daysBetween(t.transactionDate, input.today) <= 30
    );
    const contributed = addCents(...monthAgo.map((t) => Math.abs(t.amountCents)));
    if (contributed >= 5000) {
      out.push({
        id: makeId("positive_progress", `${activeGoal.id}:contribution:${input.today}`),
        type: "positive_progress",
        title: `You added ${formatCentsWhole(contributed)} to ${activeGoal.name} this month`,
        explanation: "That's real progress toward your goal. Keep going at whatever pace works for you.",
        effortLevel: "low",
        confidence: "high",
        evidence: [{ label: activeGoal.name, detail: `${formatCentsWhole(contributed)} contributed in the last 30 days`, accountId: activeGoal.linkedAccountId }],
        actionType: "acknowledge",
        priorityScore: 0,
        urgency: "none",
        calculation: {
          assumptions: ["Counts transfers into the linked goal account over the last 30 days."],
          dataUsed: [`${activeGoal.name} linked account history`],
          lastUpdated: input.today,
        },
        generatedAt: input.today,
      });
    }
  }
  return out;
}

export function generateInsightCandidates(input: RulesEngineInput): InsightCandidate[] {
  return [
    ...ruleSubscriptionReview(input),
    ...rulePriceIncrease(input),
    ...ruleDuplicateCharge(input),
    ...ruleAvoidableFee(input),
    ...ruleSpendingChange(input),
    ...ruleCashFlowRisk(input),
    ...ruleSavingsOpportunity(input),
    ...ruleDebtPaydown(input),
    ...ruleIdleCash(input),
    ...rulePositiveProgress(input),
  ];
}
