import { describe, expect, it } from "vitest";
import { addCents, dollarsToCents, formatCents, formatCentsWhole, maskAmount, percentChange, subtractCents } from "@/domain/money";

describe("money", () => {
  it("converts dollars to cents without floating point drift", () => {
    expect(dollarsToCents(12.99)).toBe(1299);
    expect(dollarsToCents(0.1 + 0.2)).toBe(30);
  });

  it("adds and subtracts cents as integers", () => {
    expect(addCents(100, 250, 50)).toBe(400);
    expect(subtractCents(500, 125)).toBe(375);
  });

  it("formats cents as currency", () => {
    expect(formatCents(1299)).toBe("$12.99");
    expect(formatCentsWhole(1299)).toBe("$13");
  });

  it("masks amounts for the hidden-balance privacy mode", () => {
    expect(maskAmount()).toBe("•••••");
  });

  it("computes percent change, guarding division by zero", () => {
    expect(percentChange(1000, 1100)).toBeCloseTo(0.1);
    expect(percentChange(0, 500)).toBeNull();
  });
});
