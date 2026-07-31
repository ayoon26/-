import type { Account, Institution, Transaction } from "@/domain/types";
import { nowISO } from "@/domain/dates";
import type { FinancialDataProvider, RecurringPayment } from "./interface";
import { buildMayaSeed } from "./seed/maya";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fully client-side provider used by Demo Mode. Implements the same
 * interface as the Plaid adapter so product code never branches on which
 * provider is active. Data is deterministic and regenerated fresh each time
 * connect/reset is called, relative to "now" so the demo never looks stale.
 */
export class MockFinancialDataProvider implements FinancialDataProvider {
  readonly name = "mock" as const;

  async createLinkToken(_userId: string): Promise<string> {
    await delay(300);
    return `mock-link-token-${Date.now()}`;
  }

  async exchangePublicToken(_publicToken: string): Promise<{ institution: Institution }> {
    await delay(400);
    const seed = buildMayaSeed();
    return { institution: seed.institutions[0] };
  }

  async syncAccounts(_userId: string): Promise<Account[]> {
    await delay(500);
    return buildMayaSeed().accounts;
  }

  async syncTransactions(_userId: string): Promise<Transaction[]> {
    await delay(600);
    return buildMayaSeed().transactions;
  }

  async syncRecurringPayments(_userId: string): Promise<RecurringPayment[]> {
    await delay(300);
    return buildMayaSeed().recurringStreams.map((s) => ({
      merchantName: s.merchantName,
      averageAmountCents: s.averageAmountCents,
      frequency: s.frequency,
      nextExpectedDate: s.nextExpectedDate,
      category: s.category,
    }));
  }

  async disconnectInstitution(_institutionId: string): Promise<void> {
    await delay(200);
  }

  /** Convenience for Demo Mode: returns the full normalized seed in one call. */
  async loadFullDemoSeed() {
    await delay(50);
    const seed = buildMayaSeed();
    return { ...seed, generatedAt: nowISO() };
  }
}

export const mockFinancialDataProvider = new MockFinancialDataProvider();
