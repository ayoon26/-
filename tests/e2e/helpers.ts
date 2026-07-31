import type { Page } from "@playwright/test";

/** Walks a fresh browser context through onboarding into Demo Mode, landing on Today. */
export async function startDemoAndReachToday(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await page.getByText("Build savings consistently").click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByText("I understand, continue").click();
  await page.getByText("Continue with demo data").click();
  await page.getByText("We found one thing worth a look.", { exact: false }).waitFor({ timeout: 15_000 });

  const goToToday = page.getByRole("button", { name: "Go to Today" });
  if (await goToToday.isVisible().catch(() => false)) {
    await goToToday.click();
  } else {
    await page.getByRole("button", { name: "Not useful" }).click();
  }
  await page.waitForURL(/\/today$/);
}
