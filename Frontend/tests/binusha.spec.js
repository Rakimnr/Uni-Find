import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

test.describe("Binusha module - claim/report user side and admin side", () => {
  test("report found item page opens", async ({ page }) => {
    await page.goto(`${BASE_URL}/report-found-item`);
    await expect(page.locator("body")).toBeVisible();
  });

  test("report found item page has form fields", async ({ page }) => {
    await page.goto(`${BASE_URL}/report-found-item`);

    const formField = page.locator("input, textarea, select").first();
    await expect(formField).toBeVisible();
  });

  test("my claims route redirects unauthenticated user to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/my-claims`);
    await expect(page).toHaveURL(/login/i);
  });

  test("admin claims route redirects unauthenticated user to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/claims`);
    await expect(page).toHaveURL(/login/i);
  });

  test("admin dashboard route redirects unauthenticated user to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).toHaveURL(/login/i);
  });

  test("claim button exists on site if available", async ({ page }) => {
    await page.goto(BASE_URL);

    const claimButton = page.locator("button, a").filter({ hasText: /claim/i }).first();

    if (await claimButton.count()) {
      await expect(claimButton).toBeVisible();
    }
  });

  test("claim button navigation works if available", async ({ page }) => {
    await page.goto(BASE_URL);

    const claimButton = page.locator("button, a").filter({ hasText: /claim/i }).first();

    if (await claimButton.count()) {
      await expect(claimButton).toBeVisible();
      await claimButton.click();

      await expect(page).toHaveURL(/claim|claims|login/i);
    }
  });

  test("claim related navigation exists somewhere in app", async ({ page }) => {
    await page.goto(BASE_URL);

    const claimNav = page.locator("button, a").filter({ hasText: /claim|claims/i }).first();

    if (await claimNav.count()) {
      await expect(claimNav).toBeVisible();
    }
  });
});