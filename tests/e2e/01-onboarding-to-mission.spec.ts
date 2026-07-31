import { expect, test } from "@playwright/test";

test("demo onboarding leads to a completed mission", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Make one smarter money move at a time.")).toBeVisible();

  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await expect(page.getByText("What would you most like help with?")).toBeVisible();
  await page.getByText("Stop losing money to small leaks").click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Before you connect anything")).toBeVisible();
  await page.getByText("I understand, continue").click();

  await expect(page.getByText("Connect an account, or explore first")).toBeVisible();
  await page.getByText("Continue with demo data").click();

  await expect(page.getByText("Organizing accounts")).toBeVisible();
  await expect(page.getByText("We found one thing worth a look.", { exact: false })).toBeVisible({ timeout: 15_000 });

  await page.getByRole("button", { name: "Review" }).click();
  await expect(page).toHaveURL(/\/today\/opportunity\//);

  await page.getByRole("button", { name: /Review|Got it/ }).click();
  await expect(page).toHaveURL(/\/today\/mission\//);

  await page.getByRole("button", { name: "Mark complete" }).click();
  await expect(page.getByText("Nice work.")).toBeVisible();

  await page.getByRole("button", { name: "Done" }).click();
  await expect(page).toHaveURL(/\/today$/);
});
