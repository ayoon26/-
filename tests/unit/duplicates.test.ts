import { describe, expect, it } from "vitest";
import { findPossibleDuplicates } from "@/domain/duplicates";
import type { Transaction } from "@/domain/types";

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: "t1",
    accountId: "acc_1",
    providerTransactionId: "p1",
    merchantName: "Bella Trattoria",
    originalDescription: "BELLA TRATTORIA",
    amountCents: 4250,
    currency: "USD",
    transactionDate: "2026-07-29",
    pending: false,
    category: "restaurants",
    isTransfer: false,
    excludedFromAnalysis: false,
    createdAt: "2026-07-29T18:00:00.000Z",
    updatedAt: "2026-07-29T18:00:00.000Z",
    ...overrides,
  };
}

describe("findPossibleDuplicates", () => {
  it("flags two matching charges from the same merchant minutes apart", () => {
    const a = tx({ id: "a", pending: true, createdAt: "2026-07-29T18:00:00.000Z" });
    const b = tx({ id: "b", pending: false, createdAt: "2026-07-29T18:06:00.000Z" });
    const pairs = findPossibleDuplicates([a, b]);
    expect(pairs).toHaveLength(1);
    expect(pairs[0].minutesApart).toBe(6);
  });

  it("does not flag different amounts", () => {
    const a = tx({ id: "a", amountCents: 4250 });
    const b = tx({ id: "b", amountCents: 3800 });
    expect(findPossibleDuplicates([a, b])).toHaveLength(0);
  });

  it("does not flag different merchants", () => {
    const a = tx({ id: "a" });
    const b = tx({ id: "b", merchantName: "Maple & Vine" });
    expect(findPossibleDuplicates([a, b])).toHaveLength(0);
  });

  it("ignores transfers", () => {
    const a = tx({ id: "a", isTransfer: true });
    const b = tx({ id: "b", isTransfer: true });
    expect(findPossibleDuplicates([a, b])).toHaveLength(0);
  });

  it("does not flag two posted charges far apart in time", () => {
    const a = tx({ id: "a", createdAt: "2026-07-25T18:00:00.000Z" });
    const b = tx({ id: "b", createdAt: "2026-07-29T18:00:00.000Z" });
    expect(findPossibleDuplicates([a, b])).toHaveLength(0);
  });
});
