import { expect, test } from "@playwright/test";
import { startDemoAndReachToday } from "./helpers";

test("completing a savings mission with an adjusted amount updates the goal and Progress", async ({ page }) => {
  await startDemoAndReachToday(page);

  const savingsCard = page.locator('[data-insight-type="savings_opportunity"]').first();
  await expect(savingsCard).toBeVisible({ timeout: 10_000 });

  // The savings opportunity may render as the primary card (with an inner
  // "Review" button) or a secondary card (the whole element is the button).
  const innerReviewButton = savingsCard.getByRole("button", { name: "Review" });
  if (await innerReviewButton.isVisible().catch(() => false)) {
    await innerReviewButton.click();
  } else {
    await savingsCard.click();
  }
  await expect(page).toHaveURL(/\/today\/opportunity\//);

  await page.getByRole("button", { name: "Review" }).click();
  await expect(page).toHaveURL(/\/today\/mission\//);

  const amountInput = page.getByLabel("Mission amount in dollars");
  await amountInput.fill("20");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.getByText("Currently set to $20.00")).toBeVisible();

  await page.getByRole("button", { name: "Mark complete" }).click();
  await expect(page.getByText("Nice work.")).toBeVisible();
  await page.getByRole("button", { name: "Done" }).click();

  await page.getByRole("link", { name: "Progress" }).click();
  await expect(page.getByText("Savings added")).toBeVisible();
});
