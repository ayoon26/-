/**
 * Centralized product configuration.
 *
 * "Sprout" is a placeholder working name. Everything user-facing pulls its
 * copy from this file so the product can be renamed by editing values here
 * only — no other file in the app should hardcode the product name, promise,
 * or tagline as a string literal.
 */

export const product = {
  name: "Sprout",
  shortName: "Sprout",
  tagline: "One smarter money move at a time.",
  promise: "Connect your money. Discover opportunities. Make one smart move today.",
  legalDisclaimer:
    "Sprout provides educational information and estimates. It does not provide individualized investment, tax, or legal advice.",
  supportEmail: "support@example.com",
  momentumName: "Money Momentum",
  gardenName: "Financial Garden",
  currency: "USD",
  locale: "en-US",
} as const;

export type ProductConfig = typeof product;
