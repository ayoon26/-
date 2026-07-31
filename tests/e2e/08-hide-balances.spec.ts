import { expect, test } from "@playwright/test";
import { startDemoAndReachToday } from "./helpers";

test("hiding balances masks amounts across screens without losing the underlying data", async ({ page }) => {
  await startDemoAndReachToday(page);

  const hideButton = page.getByRole("button", { name: "Hide amounts" });
  await expect(hideButton).toBeVisible();
  await hideButton.click();

  await expect(page.getByRole("button", { name: "Show amounts" })).toBeVisible();
  await expect(page.getByText("•••••").first()).toBeVisible();

  await page.getByRole("link", { name: "Money" }).click();
  await expect(page.getByText("•••••").first()).toBeVisible();

  await page.getByRole("link", { name: "Today" }).click();
  await page.getByRole("button", { name: "Show amounts" }).click();
  await expect(page.getByText("•••••")).toHaveCount(0);
});
