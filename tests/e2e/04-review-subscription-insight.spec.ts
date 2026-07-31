import { expect, test } from "@playwright/test";
import { startDemoAndReachToday } from "./helpers";

test("reviewing a recurring subscription removes it from future recommendations", async ({ page }) => {
  await startDemoAndReachToday(page);

  await page.getByRole("link", { name: "Money" }).click();
  await page.getByText("Recurring payments").click();
  await expect(page).toHaveURL(/\/money\/recurring$/);

  const cloudFitCard = page.locator("div.rounded-xl2", { hasText: "CloudFit Gym" }).first();
  await expect(cloudFitCard).toBeVisible();

  await cloudFitCard.getByRole("button", { name: "Mark reviewed" }).click();

  // Reviewing writes a progress event immediately reflected in Progress.
  await page.getByRole("link", { name: "Progress" }).click();
  await expect(page.getByText("Recurring reviewed")).toBeVisible();
});
