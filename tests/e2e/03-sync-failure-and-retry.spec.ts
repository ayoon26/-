import { expect, test } from "@playwright/test";

test("a failed connection attempt offers a working retry action", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Connect my accounts").click();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await page.getByText("I understand, continue").click();

  await page.getByRole("button", { name: "Connect institution" }).click();
  await expect(page.getByText("Can't connect yet")).toBeVisible();

  const retryButton = page.getByRole("button", { name: "Try again" });
  await expect(retryButton).toBeVisible();
  await retryButton.click();

  // Retrying re-runs the same connection attempt and still fails honestly
  // (no backend in this deployment) without crashing the page.
  await expect(page.getByText("Can't connect yet")).toBeVisible();
  await expect(page.getByText("Connect an account, or explore first")).toBeVisible();
});
