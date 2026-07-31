import { expect, test } from "@playwright/test";
import { startDemoAndReachToday } from "./helpers";

test("correcting a transaction's category is saved and takes priority over the original", async ({ page }) => {
  await startDemoAndReachToday(page);

  await page.getByRole("link", { name: "Money" }).click();
  await page.getByText("See all transactions").click();
  await expect(page).toHaveURL(/\/money\/transactions$/);

  await page.locator("li button").first().click();
  await expect(page).toHaveURL(/\/money\/transactions\//);

  const categorySelect = page.getByRole("combobox");
  await categorySelect.selectOption("shopping");

  await page.goBack();
  await page.locator("li button").first().click();
  await expect(page.getByRole("combobox")).toHaveValue("shopping");
});
