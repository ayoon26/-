import type { Account, Institution, RecurringStream, Transaction } from "@/domain/types";
import { ProviderError, type FinancialDataProvider, type RecurringPayment } from "./interface";

/**
 * Adapter for Plaid Sandbox, implementing the same FinancialDataProvider
 * contract as the mock provider so product/domain code stays untouched when
 * switching providers.
 *
 * IMPORTANT — this class is a documented integration point, not a working
 * connection, because Plaid's real API requires a secret key exchange that
 * must happen on a trusted server (never in the browser) and this project
 * ships as a static single-page app with no server component. Wiring it up
 * for real requires:
 *
 *   1. A backend endpoint (e.g. `POST /api/plaid/link-token`) that calls
 *      `plaidClient.linkTokenCreate(...)` with your `PLAID_CLIENT_ID` and
 *      `PLAID_SECRET` (sandbox) and returns the `link_token` to the client.
 *   2. Plaid Link mounted client-side with that token to collect a
 *      `public_token` from the Sandbox institution picker.
 *   3. A backend endpoint (`POST /api/plaid/exchange`) that calls
 *      `plaidClient.itemPublicTokenExchange(...)`, encrypts the resulting
 *      `access_token` at the application layer (see services/encryption),
 *      and stores it server-side — never in browser storage.
 *   4. Backend sync endpoints that call `accountsGet`, `transactionsSync`,
 *      and `transactionsRecurringGet` with the stored access token, map the
 *      response into this app's Account/Transaction/RecurringStream shapes,
 *      and return normalized records to the client.
 *   5. A Plaid webhook receiver for `SYNC_UPDATES_AVAILABLE` and
 *      `ITEM_LOGIN_REQUIRED` events.
 *
 * See README.md "Connected Mode / Plaid Sandbox setup" for the full runbook
 * and the environment variables this expects once a backend exists.
 */
export class PlaidFinancialDataProvider implements FinancialDataProvider {
  readonly name = "plaid" as const;

  constructor(private readonly backendBaseUrl: string = "/api/plaid") {}

  async createLinkToken(userId: string): Promise<string> {
    const res = await fetch(`${this.backendBaseUrl}/link-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).catch(() => undefined);
    if (!res || !res.ok) {
      throw new ProviderError(
        "Plaid Sandbox requires a backend endpoint that is not present in this static deployment. See README.md for setup instructions.",
        "link_failed"
      );
    }
    const data = await res.json();
    return data.linkToken;
  }

  async exchangePublicToken(publicToken: string): Promise<{ institution: Institution }> {
    const res = await fetch(`${this.backendBaseUrl}/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicToken }),
    }).catch(() => undefined);
    if (!res || !res.ok) {
      throw new ProviderError("Token exchange requires a backend. See README.md.", "link_failed");
    }
    return res.json();
  }

  async syncAccounts(userId: string): Promise<Account[]> {
    return this.fetchOrFail<Account[]>(`/accounts?userId=${encodeURIComponent(userId)}`);
  }

  async syncTransactions(userId: string): Promise<Transaction[]> {
    return this.fetchOrFail<Transaction[]>(`/transactions?userId=${encodeURIComponent(userId)}`);
  }

  async syncRecurringPayments(userId: string): Promise<RecurringPayment[]> {
    return this.fetchOrFail<RecurringStream[]>(`/recurring?userId=${encodeURIComponent(userId)}`) as unknown as Promise<
      RecurringPayment[]
    >;
  }

  async disconnectInstitution(institutionId: string): Promise<void> {
    await this.fetchOrFail(`/institutions/${institutionId}`, "DELETE");
  }

  private async fetchOrFail<T>(path: string, method: "GET" | "DELETE" = "GET"): Promise<T> {
    const res = await fetch(`${this.backendBaseUrl}${path}`, { method }).catch(() => undefined);
    if (!res || !res.ok) {
      throw new ProviderError(
        "This action requires a live backend with Plaid Sandbox credentials configured. See README.md.",
        "sync_failed"
      );
    }
    return res.json();
  }
}

export const plaidFinancialDataProvider = new PlaidFinancialDataProvider();
