import { expect, test } from "@playwright/test";

/**
 * This build ships without a backend token-exchange server (see README.md),
 * so "Connect institution" must fail honestly rather than pretend to
 * succeed. This test documents that contract.
 */
test("attempting a real Plaid Sandbox connection surfaces an honest, actionable error", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Connect my accounts").click();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await page.getByText("I understand, continue").click();

  await page.getByRole("button", { name: "Connect institution" }).click();
  await expect(page.getByText("Can't connect yet")).toBeVisible();
  await expect(page.getByText(/Plaid Sandbox needs a backend/i)).toBeVisible();

  // The user can still proceed with sample data after the honest failure.
  await page.getByText("Continue with demo data").click();
  await expect(page.getByText("Organizing accounts")).toBeVisible();
});
