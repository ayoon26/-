import type { Account, Goal, Institution, RecurringStream, Transaction } from "@/domain/types";
import { addDaysISO, nowISO, toISODate } from "@/domain/dates";

/**
 * A coherent fictional demo user, "Maya", with six months of internally
 * consistent transaction history and ten intentional insight opportunities
 * (see README's "Seeded demo scenario" section for the full list mapped to
 * rule types).
 */

let txCounter = 0;
function txId() {
  txCounter += 1;
  return `tx_maya_${txCounter}`;
}

function daysAgoISO(days: number): string {
  return toISODate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
}

function isoMinutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

interface Seed {
  institutions: Institution[];
  accounts: Account[];
  transactions: Transaction[];
  recurringStreams: RecurringStream[];
  goals: Goal[];
}

export function buildMayaSeed(): Seed {
  const today = toISODate(new Date());
  const nowIsoTimestamp = nowISO();

  const institutions: Institution[] = [
    {
      id: "inst_cascade",
      provider: "mock",
      providerInstitutionId: "mock_cascade_bank",
      name: "Cascade Bank",
      logoEmoji: "🏦",
      status: "connected",
      lastSyncedAt: nowIsoTimestamp,
      createdAt: daysAgoISO(182),
    },
    {
      id: "inst_meridian",
      provider: "mock",
      providerInstitutionId: "mock_meridian_card",
      name: "Meridian Card Co.",
      logoEmoji: "💳",
      status: "connected",
      lastSyncedAt: nowIsoTimestamp,
      createdAt: daysAgoISO(182),
    },
    {
      id: "inst_horizon",
      provider: "mock",
      providerInstitutionId: "mock_horizon_financial",
      name: "Horizon Financial",
      logoEmoji: "🪪",
      status: "connected",
      // Intentionally stale (>36h) to exercise the stale-data state.
      lastSyncedAt: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
      createdAt: daysAgoISO(150),
    },
    {
      id: "inst_fedloan",
      provider: "mock",
      providerInstitutionId: "mock_federal_loan_servicing",
      name: "Federal Loan Servicing",
      logoEmoji: "🎓",
      status: "connected",
      lastSyncedAt: nowIsoTimestamp,
      createdAt: daysAgoISO(365),
    },
    {
      id: "inst_beacon",
      provider: "mock",
      providerInstitutionId: "mock_beacon_investments",
      name: "Beacon Investments",
      logoEmoji: "📈",
      status: "connected",
      lastSyncedAt: nowIsoTimestamp,
      createdAt: daysAgoISO(365),
    },
  ];

  const accounts: Account[] = [
    {
      id: "acc_checking",
      institutionId: "inst_cascade",
      providerAccountId: "mock_checking",
      name: "Everyday Checking",
      officialName: "Cascade Bank Everyday Checking",
      mask: "4821",
      type: "cash",
      subtype: "checking",
      currency: "USD",
      currentBalanceCents: 0, // computed below from seeded transaction flows
      availableBalanceCents: 0,
      isHidden: false,
      lastSyncedAt: nowIsoTimestamp,
    },
    {
      id: "acc_savings",
      institutionId: "inst_cascade",
      providerAccountId: "mock_savings",
      name: "Rainy Day Savings",
      officialName: "Cascade Bank Savings",
      mask: "9910",
      type: "cash",
      subtype: "savings",
      currency: "USD",
      currentBalanceCents: 65_000,
      availableBalanceCents: 65_000,
      isHidden: false,
      lastSyncedAt: nowIsoTimestamp,
    },
    {
      id: "acc_meridian",
      institutionId: "inst_meridian",
      providerAccountId: "mock_meridian_visa",
      name: "Meridian Rewards Visa",
      officialName: "Meridian Rewards Visa Signature",
      mask: "2214",
      type: "credit",
      subtype: "credit_card",
      currency: "USD",
      currentBalanceCents: 124_000,
      limitCents: 500_000,
      aprBasisPoints: 2499,
      isHidden: false,
      lastSyncedAt: nowIsoTimestamp,
    },
    {
      id: "acc_horizon",
      institutionId: "inst_horizon",
      providerAccountId: "mock_horizon_cashback",
      name: "Horizon Cashback Card",
      officialName: "Horizon Financial Cashback Card",
      mask: "7743",
      type: "credit",
      subtype: "credit_card",
      currency: "USD",
      currentBalanceCents: 38_000,
      limitCents: 300_000,
      aprBasisPoints: 1899,
      isHidden: false,
      lastSyncedAt: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "acc_studentloan",
      institutionId: "inst_fedloan",
      providerAccountId: "mock_student_loan",
      name: "Federal Student Loan",
      officialName: "Direct Subsidized Loan",
      mask: "0091",
      type: "loan",
      subtype: "student_loan",
      currency: "USD",
      currentBalanceCents: 1_840_000,
      aprBasisPoints: 549,
      isHidden: false,
      lastSyncedAt: nowIsoTimestamp,
    },
    {
      id: "acc_brokerage",
      institutionId: "inst_beacon",
      providerAccountId: "mock_brokerage",
      name: "Beacon Brokerage",
      officialName: "Beacon Investments Individual Brokerage",
      mask: "5567",
      type: "investment",
      subtype: "brokerage",
      currency: "USD",
      currentBalanceCents: 215_000,
      isHidden: false,
      lastSyncedAt: nowIsoTimestamp,
    },
  ];

  const transactions: Transaction[] = [];
  const push = (t: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "currency" | "isTransfer" | "excludedFromAnalysis" | "pending"> & Partial<Pick<Transaction, "isTransfer" | "excludedFromAnalysis" | "pending" | "createdAt">>) => {
    transactions.push({
      id: txId(),
      currency: "USD",
      isTransfer: t.isTransfer ?? false,
      excludedFromAnalysis: t.excludedFromAnalysis ?? false,
      pending: t.pending ?? false,
      createdAt: t.createdAt ?? `${t.transactionDate}T12:00:00.000Z`,
      updatedAt: t.createdAt ?? `${t.transactionDate}T12:00:00.000Z`,
      ...t,
    });
  };

  // --- Six months of recurring bills, subscriptions, and income ---
  for (let monthsAgo = 6; monthsAgo >= 1; monthsAgo--) {
    const d = monthsAgo * 30;
    // Payroll, twice a month
    push({
      accountId: "acc_checking",
      providerTransactionId: `payroll_${monthsAgo}_a`,
      merchantName: "Nimbus Analytics Payroll",
      originalDescription: "NIMBUS ANALYTICS DIRECT DEP",
      amountCents: -215_000,
      transactionDate: daysAgoISO(d),
      category: "income",
    });
    push({
      accountId: "acc_checking",
      providerTransactionId: `payroll_${monthsAgo}_b`,
      merchantName: "Nimbus Analytics Payroll",
      originalDescription: "NIMBUS ANALYTICS DIRECT DEP",
      amountCents: -215_000,
      transactionDate: daysAgoISO(d - 15),
      category: "income",
    });
    // Rent
    push({
      accountId: "acc_checking",
      providerTransactionId: `rent_${monthsAgo}`,
      merchantName: "Parkview Apartments",
      originalDescription: "PARKVIEW APTS RENT",
      amountCents: 145_000,
      transactionDate: daysAgoISO(d - 1),
      category: "rent_housing",
    });
    // Streambox — price increase on the most recent charge
    push({
      accountId: "acc_meridian",
      providerTransactionId: `streambox_${monthsAgo}`,
      merchantName: "Streambox",
      originalDescription: "STREAMBOX MONTHLY",
      amountCents: monthsAgo === 1 ? 14_99 : 12_99,
      transactionDate: daysAgoISO(d - 3),
      category: "subscriptions",
    });
    // CloudFit gym membership
    push({
      accountId: "acc_meridian",
      providerTransactionId: `cloudfit_${monthsAgo}`,
      merchantName: "CloudFit Gym",
      originalDescription: "CLOUDFIT MEMBERSHIP",
      amountCents: 39_99,
      transactionDate: daysAgoISO(d - 5),
      category: "gym_wellness",
    });
    // MusicWave subscription (stable price; this one gets dismissed and should not reappear)
    push({
      accountId: "acc_meridian",
      providerTransactionId: `musicwave_${monthsAgo}`,
      merchantName: "MusicWave",
      originalDescription: "MUSICWAVE MONTHLY",
      amountCents: 9_99,
      transactionDate: daysAgoISO(d - 7),
      category: "subscriptions",
    });
    // Phone bill — due soon this cycle
    push({
      accountId: "acc_checking",
      providerTransactionId: `phone_${monthsAgo}`,
      merchantName: "Orbit Mobile",
      originalDescription: "ORBIT MOBILE BILL PAY",
      amountCents: 65_00,
      transactionDate: daysAgoISO(d - 27),
      category: "utilities",
    });
    // Variable utility bill (excluded from price-increase detection)
    push({
      accountId: "acc_checking",
      providerTransactionId: `utility_${monthsAgo}`,
      merchantName: "City Electric & Water",
      originalDescription: "CITY ELECTRIC AND WATER",
      amountCents: [8_800, 9_500, 11_200, 8_400, 10_600, 13_000][monthsAgo - 1],
      transactionDate: daysAgoISO(d - 10),
      category: "utilities",
    });
    // Groceries, weekly-ish
    for (let w = 0; w < 4; w++) {
      push({
        accountId: "acc_checking",
        providerTransactionId: `groceries_${monthsAgo}_${w}`,
        merchantName: "Green Aisle Market",
        originalDescription: "GREEN AISLE MARKET",
        amountCents: 78_00 + (w % 3) * 6_00,
        transactionDate: daysAgoISO(d - w * 7 - 2),
        category: "groceries",
      });
    }
    // Transportation
    for (let w = 0; w < 3; w++) {
      push({
        accountId: "acc_horizon",
        providerTransactionId: `transport_${monthsAgo}_${w}`,
        merchantName: "CityLine Transit",
        originalDescription: "CITYLINE TRANSIT AUTOLOAD",
        amountCents: 30_00,
        transactionDate: daysAgoISO(d - w * 9 - 3),
        category: "transportation",
      });
    }
  }

  // --- Restaurant spending: prior week higher, most recent week improved (positive spending_change) ---
  const priorWeekDining = [42_00, 38_50, 26_00, 31_00];
  priorWeekDining.forEach((amount, i) => {
    push({
      accountId: "acc_horizon",
      providerTransactionId: `dining_prior_${i}`,
      merchantName: ["Bella Trattoria", "Maple & Vine", "Corner Noodle Bar", "Bella Trattoria"][i],
      originalDescription: "RESTAURANT PURCHASE",
      amountCents: amount,
      transactionDate: daysAgoISO(10 - i),
      category: "restaurants",
    });
  });
  const recentWeekDining = [22_00, 19_50];
  recentWeekDining.forEach((amount, i) => {
    push({
      accountId: "acc_horizon",
      providerTransactionId: `dining_recent_${i}`,
      merchantName: ["Corner Noodle Bar", "Maple & Vine"][i],
      originalDescription: "RESTAURANT PURCHASE",
      amountCents: amount,
      transactionDate: daysAgoISO(3 - i),
      category: "restaurants",
    });
  });

  // --- Possible duplicate charge: two identical Bella Trattoria charges minutes apart ---
  push({
    accountId: "acc_horizon",
    providerTransactionId: "dup_a",
    merchantName: "Bella Trattoria",
    originalDescription: "BELLA TRATTORIA",
    amountCents: 42_50,
    transactionDate: daysAgoISO(2),
    pending: true,
    createdAt: isoMinutesAgo(2 * 24 * 60 + 40),
    category: "restaurants",
  });
  push({
    accountId: "acc_horizon",
    providerTransactionId: "dup_b",
    merchantName: "Bella Trattoria",
    originalDescription: "BELLA TRATTORIA",
    amountCents: 42_50,
    transactionDate: daysAgoISO(2),
    pending: false,
    createdAt: isoMinutesAgo(2 * 24 * 60 + 34),
    category: "restaurants",
  });

  // --- Avoidable ATM fee ---
  push({
    accountId: "acc_checking",
    providerTransactionId: "atm_fee_1",
    merchantName: "Cascade Bank",
    originalDescription: "OUT-OF-NETWORK ATM FEE",
    amountCents: 4_50,
    transactionDate: daysAgoISO(18),
    category: "fees_interest",
  });

  // --- Credit card interest charge (education opportunity, feeds debt_paydown evidence) ---
  push({
    accountId: "acc_meridian",
    providerTransactionId: "interest_charge_1",
    merchantName: "Meridian Card Co.",
    originalDescription: "PURCHASE INTEREST CHARGE",
    amountCents: 28_40,
    transactionDate: daysAgoISO(9),
    category: "fees_interest",
  });

  // --- Savings milestone: a recent transfer into the emergency fund ---
  push({
    accountId: "acc_savings",
    providerTransactionId: "savings_contribution_1",
    merchantName: "Transfer from Everyday Checking",
    originalDescription: "TRANSFER FROM CHECKING",
    amountCents: -100_00,
    transactionDate: daysAgoISO(10),
    category: "transfer",
    isTransfer: true,
  });

  const recurringStreams: RecurringStream[] = [
    {
      id: "rs_income",
      merchantName: "Nimbus Analytics Payroll",
      type: "income",
      category: "income",
      averageAmountCents: 215_000,
      lastAmountCents: 215_000,
      frequency: "biweekly",
      nextExpectedDate: addDaysISO(today, 4),
      confidence: "high",
      status: "active",
      essential: true,
      transactionIds: transactions.filter((t) => t.providerTransactionId.startsWith("payroll_")).map((t) => t.id),
    },
    {
      id: "rs_rent",
      merchantName: "Parkview Apartments",
      type: "bill",
      category: "rent_housing",
      averageAmountCents: 145_000,
      lastAmountCents: 145_000,
      frequency: "monthly",
      nextExpectedDate: addDaysISO(today, 20),
      confidence: "high",
      status: "active",
      essential: true,
      transactionIds: transactions.filter((t) => t.providerTransactionId.startsWith("rent_")).map((t) => t.id),
    },
    {
      id: "rs_streambox",
      merchantName: "Streambox",
      type: "subscription",
      category: "subscriptions",
      averageAmountCents: 12_99,
      lastAmountCents: 14_99,
      previousAmountCents: 12_99,
      frequency: "monthly",
      nextExpectedDate: addDaysISO(today, 22),
      confidence: "high",
      status: "active",
      essential: false,
      transactionIds: transactions.filter((t) => t.providerTransactionId.startsWith("streambox_")).map((t) => t.id),
    },
    {
      id: "rs_cloudfit",
      merchantName: "CloudFit Gym",
      type: "membership",
      category: "gym_wellness",
      averageAmountCents: 39_99,
      lastAmountCents: 39_99,
      previousAmountCents: 39_99,
      frequency: "monthly",
      nextExpectedDate: addDaysISO(today, 25),
      confidence: "high",
      status: "active",
      essential: false,
      transactionIds: transactions.filter((t) => t.providerTransactionId.startsWith("cloudfit_")).map((t) => t.id),
    },
    {
      id: "rs_musicwave",
      merchantName: "MusicWave",
      type: "subscription",
      category: "subscriptions",
      averageAmountCents: 9_99,
      lastAmountCents: 9_99,
      previousAmountCents: 9_99,
      frequency: "monthly",
      nextExpectedDate: addDaysISO(today, 23),
      confidence: "high",
      status: "active",
      essential: false,
      transactionIds: transactions.filter((t) => t.providerTransactionId.startsWith("musicwave_")).map((t) => t.id),
      // Already reviewed recently — demonstrates a dismissed insight that should not reappear.
      userReviewedAt: daysAgoISO(10),
    },
    {
      id: "rs_phone",
      merchantName: "Orbit Mobile",
      type: "bill",
      category: "utilities",
      averageAmountCents: 65_00,
      lastAmountCents: 65_00,
      previousAmountCents: 65_00,
      frequency: "monthly",
      nextExpectedDate: addDaysISO(today, 3),
      confidence: "high",
      status: "active",
      essential: true,
      transactionIds: transactions.filter((t) => t.providerTransactionId.startsWith("phone_")).map((t) => t.id),
    },
    {
      id: "rs_utilities",
      merchantName: "City Electric & Water",
      type: "bill",
      category: "utilities",
      averageAmountCents: 10_250,
      lastAmountCents: 13_000,
      previousAmountCents: 10_600,
      frequency: "monthly",
      nextExpectedDate: addDaysISO(today, 12),
      confidence: "medium",
      status: "active",
      essential: true,
      transactionIds: transactions.filter((t) => t.providerTransactionId.startsWith("utility_")).map((t) => t.id),
    },
  ];

  const goals: Goal[] = [
    {
      id: "goal_emergency",
      name: "Emergency Fund",
      type: "emergency_fund",
      targetAmountCents: 300_000,
      currentAmountCents: 65_000,
      targetDate: addDaysISO(today, 240),
      linkedAccountId: "acc_savings",
      status: "active",
      createdAt: daysAgoISO(90),
      updatedAt: daysAgoISO(10),
    },
  ];

  // Give the checking account a realistic computed balance based on seeded flows.
  const checkingAccount = accounts.find((a) => a.id === "acc_checking")!;
  const net = transactions
    .filter((t) => t.accountId === "acc_checking")
    .reduce((sum, t) => sum - t.amountCents, 0); // inflow negative amounts add, outflow positive amounts subtract
  checkingAccount.currentBalanceCents = 180_000 + net;
  checkingAccount.availableBalanceCents = checkingAccount.currentBalanceCents;

  return { institutions, accounts, transactions, recurringStreams, goals };
}
