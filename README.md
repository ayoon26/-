# Sprout — a playful personal finance coach

> Connect your money. Discover opportunities. Make one smart move today.

Sprout turns connected account data into one clear, small financial action at
a time — not another budgeting dashboard. This repository is a working MVP
built around a fully-functional **Demo Mode** (no external credentials
required) plus a documented, ready-to-wire **Connected Mode** for a real
account aggregator (Plaid Sandbox).

"Sprout" is a placeholder product name. Every user-facing string that names
the product pulls from **`src/config/product.ts`** — rename the app by
editing that one file.

---

## 1. What's actually shipped vs. what's a documented seam

This build runs as a **static, mobile-first single-page app** (Vite + React
+ TypeScript + Tailwind), not a full Next.js server stack. That's a
deliberate scoping decision for this environment (no provisioned Postgres
database, no Plaid/Supabase/Clerk credentials, no server runtime target),
not an oversight. Concretely:

**Fully working today:**
- Demo Mode end-to-end: onboarding → seeded 6-month history for a fictional
  user, Maya → deterministic rules engine → ranked recommendations →
  missions → Money Momentum → weekly reflection → financial garden.
- The deterministic insight rules engine, ranking/scoring, and money math —
  all pure, tested, framework-free TypeScript in `src/domain`.
- The `FinancialDataProvider` interface with a real mock implementation.
- Client-side persistence (Zustand + `localStorage`) standing in for a
  database, behind the same store API a real backend would sit behind.
- Transaction correction, dismissal/snooze/cooldown logic, goal pacing,
  privacy controls (hide balances, export, delete imported data, delete
  account), recommendation category preferences.
- A typed, redacting analytics wrapper and a template-based AI-explanation
  seam (see §7).

**Documented but not wired (needs a backend that doesn't exist yet):**
- The **Plaid Sandbox adapter** (`src/providers/financial-data/plaid-provider.ts`)
  implements the same interface as the mock provider, but every method calls
  a `/api/plaid/*` backend endpoint that this static deployment doesn't
  serve. Attempting to connect a real institution fails with an honest,
  in-product error message and a pointer to §6 below — it never pretends to
  succeed.
- Real authentication (Supabase Auth / Clerk). The "Sign in" screen creates a
  local profile keyed by email in this browser only — no password, no
  session token, no server verification. See §8 "Known limitations."
- Postgres + Prisma. The data model in §5 mirrors the spec's schema as
  TypeScript types (`src/domain/types.ts`) and is manipulated through a
  single store module (`src/lib/store.ts`) whose action surface is the same
  shape a Prisma-backed API would expose — swapping the storage layer means
  changing that one file's internals, not any screen or domain function.

Every deterministic financial rule, all money math, and the entire Demo Mode
product experience are real, tested, and fully interactive — that's the part
of the spec this build optimized for, since it's the part explicitly
callable as "shippable" without external services.

---

## 2. Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (e.g. `http://localhost:5173`), click **Explore
with sample data**, and you'll reach a first opportunity within the three
onboarding screens the spec calls for — no signup, no API keys.

Other commands:

```bash
npm run build      # typecheck + production build
npm run preview    # serve the production build locally
npm run lint       # ESLint (TypeScript + React Hooks rules)
npm run test       # Vitest unit + integration tests
npm run test:e2e   # Playwright end-to-end tests (builds + serves first)
```

There is no seed *script* to run separately — Demo Mode generates Maya's six
months of data on demand (`src/providers/financial-data/seed/maya.ts`) the
moment you click "Continue with demo data," and again from **Profile →
Reset demo data**. There are no demo account credentials because Demo Mode
doesn't require signing in at all.

---

## 3. Architecture

```
src/
  config/product.ts        Centralized product name/copy — the only place to rename "Sprout"
  domain/                  Pure, framework-free financial logic (see §4)
    insights/               Rules engine, ranking, evidence types
  providers/financial-data/ FinancialDataProvider interface + mock + Plaid adapters, Maya seed
  services/
    analytics/              Typed event wrapper with payload redaction
    ai-explanations/        Template-based plain-language rewriter (LLM seam, see §7)
  lib/
    store.ts                Zustand store: the app's client-side "database" + action surface
    validation.ts           Zod schemas for the app's real forms
    money.ts, id.ts
  components/               Reusable UI (ui/, insights/, nav/)
  screens/                  One folder per navigation area (onboarding, today, money, goals,
                             progress, profile), matching the 4-tab nav + onboarding flow
tests/
  unit/                     Domain logic (money, recurring, duplicates, cash flow, ranking, goals)
  integration/              Seed → insight generation, store lifecycle, analytics redaction
  e2e/                      Playwright, one file per spec scenario (see §9)
```

Domain calculations never import from `components/` or `screens/` — data
flows one direction: `providers` → `store` → `domain` (pure functions) →
`screens/components` (render only). Every financial calculation is integer
cents (`src/domain/money.ts`); no float arithmetic touches a dollar amount
anywhere in the codebase.

### Data model

`src/domain/types.ts` defines `User`, `UserPreferences`, `Institution`,
`Account`, `Transaction`, `RecurringStream`, `Goal`, `ConsentRecord`,
`AuditEvent`; `src/domain/insights/types.ts` defines `InsightCandidate` /
`StoredInsight`; `src/domain/missions.ts` defines `Mission`;
`src/domain/progress.ts` defines `ProgressEvent`. These mirror the schema in
the product spec field-for-field, modeled as TypeScript types instead of a
Prisma schema since there's no provisioned database in this environment —
migrating to Postgres means writing a `schema.prisma` from these types and
replacing `src/lib/store.ts`'s internals with API calls; no domain or UI code
would need to change.

---

## 4. The rules engine (deterministic, not AI)

`src/domain/insights/rules.ts` implements ten rules from structured account
and transaction data — subscription review, price increase, duplicate
charge, avoidable fee, spending change, cash-flow risk, savings opportunity,
debt paydown, idle cash, and positive progress — each producing an
`InsightCandidate` with its own evidence, confidence, effort, and a full
calculation trail (assumptions, data used, date range, last-updated) that
powers the in-product "Show me the math" view.

`src/domain/insights/ranking.ts` scores candidates as
`(impact × confidence × goal-relevance × urgency) ÷ effort`, then enforces
the product constraints: at most one high-urgency item surfaced, dismissed
insights suppressed for 30 days (`DISMISS_COOLDOWN_DAYS`), one primary + up
to two secondary opportunities, and per-category user preferences respected
before scoring even runs.

None of this touches a language model. AI is used **only** to rewrite
already-computed numbers in plain language (see §7) — it never calculates a
balance, a projection, or an insight's dollar amount.

---

## 5. Provider abstraction

```ts
interface FinancialDataProvider {
  createLinkToken(userId: string): Promise<string>;
  exchangePublicToken(publicToken: string): Promise<{ institution: Institution }>;
  syncAccounts(userId: string): Promise<Account[]>;
  syncTransactions(userId: string): Promise<Transaction[]>;
  syncRecurringPayments(userId: string): Promise<RecurringPayment[]>;
  disconnectInstitution(institutionId: string): Promise<void>;
}
```

- `MockFinancialDataProvider` (`mock-provider.ts`) implements this fully,
  backed by the Maya seed generator. This is what Demo Mode uses.
- `PlaidFinancialDataProvider` (`plaid-provider.ts`) implements the same
  interface against `/api/plaid/*` endpoints. It is real, typed, importable
  code — not a stub function that throws — but those endpoints don't exist
  in this deployment, so every call fails with a `ProviderError` and an
  in-product message pointing here. See §6 to make it real.

All data returned by either provider is **read-only**. Nothing in this
codebase moves money, cancels a subscription, places a trade, or changes an
account — every mission requires explicit user confirmation, and completing
one only ever updates *this app's own* records.

---

## 6. Connected Mode / Plaid Sandbox setup (for a future backend)

This is the runbook for the person who adds the backend this static app
doesn't ship with:

1. **Create a Plaid Sandbox account** at https://dashboard.plaid.com and
   grab `PLAID_CLIENT_ID` / `PLAID_SECRET` (sandbox) — see `.env.example`.
2. **Add a server.** Any small Node service (Express, a Next.js API route
   set, a Cloudflare Worker) works; it just needs to hold the Plaid secret,
   which must never reach the browser.
3. **`POST /api/plaid/link-token`** — call `plaidClient.linkTokenCreate(...)`
   and return `{ linkToken }`. `PlaidFinancialDataProvider.createLinkToken`
   already expects this exact shape.
4. Mount Plaid Link client-side with that token; it returns a `public_token`
   after the user picks a Sandbox institution (use Plaid's sandbox test
   credentials, e.g. `user_good` / `pass_good`).
5. **`POST /api/plaid/exchange`** — call
   `plaidClient.itemPublicTokenExchange(...)`, encrypt the resulting
   `access_token` at the application layer (never store it plain — see §8),
   and persist it server-side keyed to the institution.
6. **`GET /api/plaid/accounts`, `/transactions`, `/recurring`** — call
   `accountsGet`, `transactionsSync`, `transactionsRecurringGet` with the
   stored access token, map Plaid's response shape into this app's
   `Account` / `Transaction` / `RecurringStream` types (`src/domain/types.ts`),
   and return normalized JSON. `PlaidFinancialDataProvider` already calls
   these exact paths.
7. **`DELETE /api/plaid/institutions/:id`** — call `itemRemove` then delete
   the stored token.
8. **Webhooks** — point Plaid's webhook at a receiver that handles
   `SYNC_UPDATES_AVAILABLE` (trigger a re-sync) and `ITEM_LOGIN_REQUIRED`
   (mark the institution `reauth_required`, matching the `Institution.status`
   union already in the type).

Once that server exists, swap `mockFinancialDataProvider` for
`plaidFinancialDataProvider` at the call sites in `src/screens/onboarding/Connect.tsx`
— no other file changes, because both implement the same interface.

---

## 7. AI usage boundary

`src/services/ai-explanations/index.ts` is the only place an LLM call would
ever be introduced, and it's restricted by design to rewriting fields that
`InsightCandidate.calculation` already contains — this build ships a
template-based implementation (zero external API calls, zero API keys
needed) so the product works standalone. If a real model is wired in later,
it must keep passing `calculation.assumptions` / `dataUsed` /
`lastUpdated` straight through to "Show me the math" untouched — the AI
layer explains, it never recalculates or hides uncertainty.

---

## 8. Security, privacy, and known limitations

**What's implemented:**
- Integer-cents money math everywhere; no floating-point dollar arithmetic.
- Analytics payload redaction (`src/services/analytics/index.ts` strips
  amounts, balances, descriptions, tokens, notes before anything reaches a
  sink) — verified in `tests/integration/analyticsRedaction.test.ts`.
- Full privacy center: view connected institutions + data categories used +
  last sync time, disconnect an institution, export user-generated data as
  JSON, delete imported data (keeps goals/preferences), delete the account
  entirely. All four are real, working actions (`src/screens/profile/PrivacyControls.tsx`),
  not mockups.
- Consent recorded on accepting the risk disclosure (`ConsentRecord`), and
  disconnect/delete actions recorded as `AuditEvent`s.
- Recommendation-category and notification preferences the user can turn
  off individually.
- Deterministic, tested financial calculations; AI never controls a balance
  or a calculation (§7).

**Known limitations — read before treating this as production-ready:**
- **No real backend, database, or auth.** `src/lib/store.ts` persists to
  browser `localStorage` via Zustand's `persist` middleware. This is
  explicitly a client-side stand-in, not encrypted, not multi-device, and
  not appropriate for real account credentials or access tokens. A
  production deployment must move this behind an authenticated API with
  row-level authorization, exactly as the spec requires.
- **"Sign in" is not authentication.** It creates a same-device profile with
  no password or session verification. Do not treat it as an access control
  boundary.
- **No token encryption exists yet** because no token is ever stored — there
  is no live Plaid connection in this build. §6 covers where
  application-layer encryption must be added the moment one exists.
- **No rate limiting, CSRF protection, or secure headers**, since there is no
  server surface in this deployment to apply them to.
- **Transaction "split category"** (spec §10) is not implemented — correcting
  category, merchant, transfer status, exclusion, notes, and duplicate
  reporting are all implemented, but splitting one transaction into multiple
  partial-amount records would require extending the `Transaction` model and
  was cut for scope.
- **PostHog/Sentry are abstractions only.** `services/analytics` ships a
  console sink; wiring a real one means implementing `AnalyticsSink` and
  calling `configureAnalyticsSink` once at startup.
- **No native packaging** (biometric auth, push notifications) — this is a
  responsive web app; the spec's "package as native" note is future work.

---

## 9. Testing

```bash
npm run test        # unit + integration (Vitest)
npm run test:e2e     # end-to-end (Playwright, chromium)
```

- **Unit** (`tests/unit/`): money math, recurring-price comparison and
  review-cooldown eligibility, duplicate detection, cash-flow projection,
  safety-buffer / max-safe-savings-transfer logic, insight priority scoring,
  30-day dismissal cooldown, goal progress and pacing.
- **Integration** (`tests/integration/`): the rules engine against the full
  seeded Maya scenario (every intentional opportunity from §10 is asserted),
  the store's demo-mode → mission-accept → mission-complete lifecycle
  (including the savings mission actually moving the balance), transaction
  correction, the deletion flows, and analytics redaction.
- **End-to-end** (`tests/e2e/`), one file per required scenario: demo
  onboarding to a completed mission; attempting (and honestly failing) a
  Plaid Sandbox connection; a failed connection's retry action; reviewing a
  subscription; correcting a transaction category; dismissing a
  recommendation; completing a savings mission with an adjusted amount;
  hiding balances; disconnecting an institution; deleting imported data.

Running the Playwright suite while building this caught a real bug worth
noting: an early version subscribed to derived store values
(`s.accounts.filter(...)`, `s.getRankedInsights()`) directly as Zustand
selectors. Because `.filter()`/rule-engine calls return a new array/object
reference on every invocation, React's `useSyncExternalStore` saw a
"changed" snapshot on every render and looped ("Maximum update depth
exceeded") — invisible to unit tests, immediately visible as a blank screen
in the browser. The fix (`src/hooks/useRankedInsights.ts`, plus selecting
raw state and filtering in the render body elsewhere) is now the pattern to
follow for any new derived selector.

---

## 10. Seeded demo scenario

Maya (`src/providers/financial-data/seed/maya.ts`) has a checking + savings
account, two credit cards, a student loan, a brokerage account, biweekly
salary, rent, three subscriptions, a gym membership, and six months of
grocery/dining/transportation history. Ten intentional opportunities are
built in and covered by `tests/integration/seedInsights.test.ts`:

1. Streambox subscription price increase ($12.99 → $14.99)
2. Possible duplicate $42.50 Bella Trattoria charges, ~6 minutes apart
3. An avoidable out-of-network ATM fee
4. Restaurant spending improved vs. the prior week
5. A safe small emergency-fund contribution opportunity
6. Meridian Rewards Visa interest charge (debt-paydown / interest context)
7. Orbit Mobile bill due within 3 days
8. A $100 savings contribution recorded as positive progress
9. MusicWave — pre-seeded as already reviewed/dismissed, so it does not
   reappear
10. Horizon Cashback Card — pre-seeded with a stale (52-hour-old) sync
    timestamp, so the stale-data UI is visible from first load

---

## 11. Analytics event dictionary

Defined in `src/services/analytics/index.ts`. Every payload is redacted
(amounts, balances, descriptions, tokens, notes stripped) before reaching a
sink.

| Event | Payload |
|---|---|
| `onboarding_started` | — |
| `goal_selected` | `goals: string[]` |
| `demo_mode_started` | — |
| `account_link_started` | — |
| `account_link_completed` | `institutionCount` |
| `account_link_failed` | `reason` |
| `first_insight_viewed` | `insightType` |
| `insight_explanation_opened` | `insightType` |
| `mission_accepted` | `missionType`, `category` |
| `mission_modified` | `missionType` |
| `mission_snoozed` | `missionType` |
| `mission_dismissed` | `missionType`, `hasReason` |
| `mission_completed` | `missionType`, `category` |
| `transaction_corrected` | `field` |
| `recommendation_feedback_submitted` | `insightType`, `feedback` |
| `weekly_review_viewed` | — |
| `institution_disconnected` | — |
| `data_deleted` | `scope` |

---

## 12. Privacy & deletion workflow

Reachable from **Profile → Privacy & data controls**:

- **View**: connected institutions, the data categories used and why, last
  sync time per account.
- **Export**: downloads a JSON file of goals, preferences, and any
  user-entered transaction corrections/notes — never raw balances or
  provider tokens.
- **Disconnect an institution**: marks it `disconnected` and hides its
  accounts from totals; recorded as an `AuditEvent`.
- **Delete imported data**: clears transactions, recurring streams,
  insights, and missions; keeps goals and preferences. Requires an in-UI
  confirmation step.
- **Delete account**: clears everything, including the local user profile,
  and returns to Welcome. Requires an in-UI confirmation step.

---

## 13. Deployment

This is a static site. `npm run build` produces `dist/`, deployable to
Vercel, Netlify, Cloudflare Pages, or any static host — the existing
`vercel.json` already points `buildCommand`/`outputDirectory` at this
project. There is no server component to deploy until §6 is implemented.
