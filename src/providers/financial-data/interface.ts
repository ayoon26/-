import type { Account, Institution, RecurringStream, Transaction } from "@/domain/types";

/**
 * Provider-agnostic contract for financial account aggregation. Product and
 * domain code must depend only on this interface, never on a specific
 * vendor SDK, so a new aggregator can be swapped in behind it.
 *
 * All data returned is read-only. No implementation of this interface may
 * move money, cancel a bill, place a trade, or otherwise mutate a financial
 * account.
 */
export interface FinancialDataProvider {
  readonly name: "mock" | "plaid";

  /** Starts a link session and returns a token the client-side widget consumes. */
  createLinkToken(userId: string): Promise<string>;

  /** Exchanges a client-side public token for a stored, encrypted access token server-side. */
  exchangePublicToken(publicToken: string): Promise<{ institution: Institution }>;

  syncAccounts(userId: string): Promise<Account[]>;

  syncTransactions(userId: string): Promise<Transaction[]>;

  syncRecurringPayments(userId: string): Promise<RecurringPayment[]>;

  disconnectInstitution(institutionId: string): Promise<void>;
}

/** Provider-native recurring-payment shape before normalization into a RecurringStream. */
export interface RecurringPayment {
  merchantName: string;
  averageAmountCents: number;
  frequency: RecurringStream["frequency"];
  nextExpectedDate: string;
  category: RecurringStream["category"];
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly code: "link_failed" | "sync_failed" | "reauth_required" | "rate_limited" | "disconnected"
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
