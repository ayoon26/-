import type { Account } from "./types";
import { addCents, type Cents } from "./money";

export interface NetPosition {
  cashCents: Cents;
  creditBalanceCents: Cents;
  investmentsCents: Cents;
  loansCents: Cents;
  totalAssetsCents: Cents;
  totalLiabilitiesCents: Cents;
  netPositionCents: Cents;
}

export function calculateNetPosition(accounts: Account[]): NetPosition {
  const visible = accounts.filter((a) => !a.isHidden);
  const cashCents = addCents(...visible.filter((a) => a.type === "cash").map((a) => a.currentBalanceCents));
  const creditBalanceCents = addCents(...visible.filter((a) => a.type === "credit").map((a) => a.currentBalanceCents));
  const investmentsCents = addCents(...visible.filter((a) => a.type === "investment").map((a) => a.currentBalanceCents));
  const loansCents = addCents(...visible.filter((a) => a.type === "loan").map((a) => a.currentBalanceCents));

  const totalAssetsCents = addCents(cashCents, investmentsCents);
  const totalLiabilitiesCents = addCents(creditBalanceCents, loansCents);

  return {
    cashCents,
    creditBalanceCents,
    investmentsCents,
    loansCents,
    totalAssetsCents,
    totalLiabilitiesCents,
    netPositionCents: totalAssetsCents - totalLiabilitiesCents,
  };
}
