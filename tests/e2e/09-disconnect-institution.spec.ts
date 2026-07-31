import { expect, test } from "@playwright/test";
import { startDemoAndReachToday } from "./helpers";

test("disconnecting an institution marks it disconnected and hides its accounts", async ({ page }) => {
  await startDemoAndReachToday(page);

  await page.getByRole("link", { name: "Profile" }).click();
  await page.getByText("Connected institutions").click();
  await expect(page).toHaveURL(/\/profile\/institutions$/);

  const firstInstitution = page.locator("div.rounded-xl2").first();
  await expect(firstInstitution).toBeVisible();
  await firstInstitution.getByRole("button", { name: "Disconnect" }).click();

  await expect(firstInstitution.getByText("disconnected")).toBeVisible();
});
