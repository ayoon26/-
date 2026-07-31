import type { Account, RecurringStream } from "./types";
import { addCents, type Cents } from "./money";
import { addDaysISO, type ISODateString } from "./dates";

export interface UpcomingObligation {
  merchantName: string;
  amountCents: Cents;
  dueDate: ISODateString;
}

export interface CashFlowProjection {
  currentCashCents: Cents;
  upcomingIncomeCents: Cents;
  upcomingObligations: UpcomingObligation[];
  totalUpcomingObligationsCents: Cents;
  projectedBalanceCents: Cents;
  nextIncomeDate?: ISODateString;
  asOf: ISODateString;
  horizonDays: number;
  atRisk: boolean;
}

/**
 * Projects cash balance through the given horizon using only recurring
 * streams expected to land within that window. Always deterministic and
 * always returns its assumptions so the UI can disclose them.
 */
export function projectCashFlow(params: {
  cashAccounts: Account[];
  recurringStreams: RecurringStream[];
  today: ISODateString;
  horizonDays?: number;
}): CashFlowProjection {
  const { cashAccounts, recurringStreams, today, horizonDays = 14 } = params;
  const currentCashCents = addCents(...cashAccounts.map((a) => a.availableBalanceCents ?? a.currentBalanceCents));
  const horizonEnd = addDaysISO(today, horizonDays);

  const upcomingBills = recurringStreams.filter(
    (s) =>
      s.status === "active" &&
      s.type !== "income" &&
      s.nextExpectedDate >= today &&
      s.nextExpectedDate <= horizonEnd
  );
  const upcomingObligations: UpcomingObligation[] = upcomingBills.map((s) => ({
    merchantName: s.merchantName,
    amountCents: s.lastAmountCents,
    dueDate: s.nextExpectedDate,
  }));
  const totalUpcomingObligationsCents = addCents(...upcomingObligations.map((o) => o.amountCents));

  const incomeStream = recurringStreams.find(
    (s) => s.type === "income" && s.status === "active" && s.nextExpectedDate >= today && s.nextExpectedDate <= horizonEnd
  );
  const upcomingIncomeCents = incomeStream?.lastAmountCents ?? 0;

  const projectedBalanceCents = currentCashCents + upcomingIncomeCents - totalUpcomingObligationsCents;

  return {
    currentCashCents,
    upcomingIncomeCents,
    upcomingObligations,
    totalUpcomingObligationsCents,
    projectedBalanceCents,
    nextIncomeDate: incomeStream?.nextExpectedDate,
    asOf: today,
    horizonDays,
    atRisk: projectedBalanceCents < 0,
  };
}

/**
 * The minimum cash buffer a savings recommendation must never dip below.
 * Kept as a pure function of current cash + upcoming obligations so it is
 * easy to unit test and reason about.
 */
export function calculateSafetyBufferCents(projection: CashFlowProjection, minimumBufferCents: Cents): Cents {
  return Math.max(minimumBufferCents, projection.totalUpcomingObligationsCents);
}

/**
 * The maximum amount that could safely move to savings today without the
 * projected balance falling below the safety buffer. Never negative.
 */
export function maxSafeSavingsTransferCents(
  projection: CashFlowProjection,
  minimumBufferCents: Cents
): Cents {
  const buffer = calculateSafetyBufferCents(projection, minimumBufferCents);
  const headroom = projection.currentCashCents + projection.upcomingIncomeCents - projection.totalUpcomingObligationsCents - buffer;
  return Math.max(0, Math.trunc(headroom));
}
