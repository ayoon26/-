import { expect, test } from "@playwright/test";
import { startDemoAndReachToday } from "./helpers";

test("deleting imported data clears transactions while keeping the account itself", async ({ page }) => {
  await startDemoAndReachToday(page);

  await page.getByRole("link", { name: "Profile" }).click();
  await page.getByText("Privacy & data controls").click();
  await expect(page).toHaveURL(/\/profile\/privacy$/);

  await page.getByRole("button", { name: "Delete imported data" }).click();
  await page.getByRole("button", { name: "Confirm delete" }).click();

  await page.getByRole("link", { name: "Money" }).click();
  await page.getByText("See all transactions").click();
  await expect(page.getByText("No transactions match.")).toBeVisible();
});
