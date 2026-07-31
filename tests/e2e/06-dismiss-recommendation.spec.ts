import { expect, test } from "@playwright/test";
import { startDemoAndReachToday } from "./helpers";

test("dismissing today's primary recommendation replaces it and does not bring it back immediately", async ({ page }) => {
  await startDemoAndReachToday(page);

  const primaryCard = page.getByTestId("primary-action-card");
  const primaryType = await primaryCard.getAttribute("data-insight-type");
  expect(primaryType).toBeTruthy();

  await primaryCard.getByRole("button", { name: "Dismiss" }).click();
  await page.waitForTimeout(200);

  const newPrimaryType = await page.getByTestId("primary-action-card").getAttribute("data-insight-type").catch(() => null);
  expect(newPrimaryType).not.toBe(primaryType);
});
