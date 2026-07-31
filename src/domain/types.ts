import type { Cents } from "./money";
import type { ISODateString } from "./dates";

export type ID = string;

export type AccountType = "cash" | "credit" | "investment" | "loan";
export type AccountSubtype =
  | "checking"
  | "savings"
  | "credit_card"
  | "brokerage"
  | "student_loan"
  | "auto_loan"
  | "mortgage"
  | "other";

export interface Institution {
  id: ID;
  provider: "mock" | "plaid";
  providerInstitutionId: string;
  name: string;
  logoEmoji: string;
  status: "connected" | "error" | "disconnected" | "reauth_required";
  lastSyncedAt: ISODateString;
  createdAt: ISODateString;
}

export interface Account {
  id: ID;
  institutionId: ID;
  providerAccountId: string;
  name: string;
  officialName: string;
  mask: string;
  type: AccountType;
  subtype: AccountSubtype;
  currency: string;
  currentBalanceCents: Cents;
  availableBalanceCents?: Cents;
  limitCents?: Cents;
  /** Annual percentage rate, only meaningful for credit/loan accounts. */
  aprBasisPoints?: number;
  isHidden: boolean;
  lastSyncedAt: ISODateString;
}

export type TransactionCategory =
  | "income"
  | "rent_housing"
  | "subscriptions"
  | "groceries"
  | "restaurants"
  | "transportation"
  | "gym_wellness"
  | "utilities"
  | "fees_interest"
  | "transfer"
  | "shopping"
  | "entertainment"
  | "other";

export interface Transaction {
  id: ID;
  accountId: ID;
  providerTransactionId: string;
  merchantName: string;
  originalDescription: string;
  amountCents: Cents;
  /** Positive amountCents = money out of the account, negative = money in. */
  currency: string;
  transactionDate: ISODateString;
  authorizedDate?: ISODateString;
  pending: boolean;
  category: TransactionCategory;
  subcategory?: string;
  userCategory?: TransactionCategory;
  userMerchantName?: string;
  isTransfer: boolean;
  excludedFromAnalysis: boolean;
  note?: string;
  reportedDuplicate?: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export function effectiveCategory(t: Transaction): TransactionCategory {
  return t.userCategory ?? t.category;
}

export function effectiveMerchantName(t: Transaction): string {
  return t.userMerchantName ?? t.merchantName;
}

/**
 * `amountCents` follows the provider convention (positive = money out,
 * negative = money in), which is what every calculation in this codebase
 * relies on. For display to a user, that reads backwards — a paycheck
 * would show a leading minus sign. This flips the sign for presentation
 * only: outflows display as negative (a debit), inflows as positive.
 */
export function displayAmountCents(t: Transaction): number {
  return -t.amountCents;
}

export type RecurringFrequency = "weekly" | "biweekly" | "monthly" | "annual" | "irregular";
export type RecurringType = "subscription" | "bill" | "income" | "membership";

export interface RecurringStream {
  id: ID;
  merchantName: string;
  type: RecurringType;
  category: TransactionCategory;
  averageAmountCents: Cents;
  lastAmountCents: Cents;
  previousAmountCents?: Cents;
  frequency: RecurringFrequency;
  nextExpectedDate: ISODateString;
  confidence: "low" | "medium" | "high";
  status: "active" | "ended";
  essential: boolean;
  transactionIds: ID[];
  userReviewedAt?: ISODateString;
  userIgnored?: boolean;
}

export type GoalType =
  | "emergency_fund"
  | "travel"
  | "debt_payoff"
  | "moving"
  | "education"
  | "major_purchase"
  | "general_cushion";

export interface Goal {
  id: ID;
  name: string;
  type: GoalType;
  targetAmountCents: Cents;
  currentAmountCents: Cents;
  targetDate?: ISODateString;
  linkedAccountId?: ID;
  status: "active" | "completed" | "paused";
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type PrimaryGoal =
  | "stop_leaks"
  | "build_savings"
  | "understand_spending"
  | "reduce_debt"
  | "feel_in_control"
  | "grow_money";

export interface RecommendationPreferences {
  subscription_review: boolean;
  price_increase: boolean;
  duplicate_charge: boolean;
  avoidable_fee: boolean;
  spending_change: boolean;
  cash_flow_risk: boolean;
  savings_opportunity: boolean;
  debt_paydown: boolean;
  idle_cash: boolean;
  goal_progress: boolean;
  positive_progress: boolean;
}

export interface NotificationPreferences {
  dailyAction: boolean;
  weeklyReflection: boolean;
  billReminders: boolean;
  milestones: boolean;
}

export interface UserPreferences {
  primaryGoals: PrimaryGoal[];
  hiddenBalances: boolean;
  gardenEnabled: boolean;
  notificationPreferences: NotificationPreferences;
  recommendationPreferences: RecommendationPreferences;
  riskDisclosureAcceptedAt?: ISODateString;
}

export interface User {
  id: ID;
  email: string;
  displayName: string;
  timezone: string;
  currency: string;
  locale: string;
  onboardingCompleted: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ConsentRecord {
  id: ID;
  consentType: "data_access" | "risk_disclosure" | "marketing";
  version: string;
  acceptedAt: ISODateString;
  revokedAt?: ISODateString;
}

export interface AuditEvent {
  id: ID;
  eventType: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  createdAt: ISODateString;
}
