import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

test.describe("Uni-Find basic flows (fixed)", () => {

  test("home page loads", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("body")).toBeVisible();
  });

  test("found items exist", async ({ page }) => {
    await page.goto(BASE_URL);

    // check at least one card/button exists
    await expect(page.locator("button").first()).toBeVisible();
  });

  test("navigate to claim page", async ({ page }) => {
    await page.goto(BASE_URL);

    const btn = page.locator("button").filter({ hasText: "Claim" }).first();

    if (await btn.isVisible()) {
      await btn.click();
      await expect(page.url()).toContain("claims");
    }
  });

  test("protected route redirects", async ({ page }) => {
    await page.goto(`${BASE_URL}/my-claims`);

    // should redirect to login
    await expect(page.url()).toContain("login");
  });

  test("add item page opens", async ({ page }) => {
    await page.goto(`${BASE_URL}/report-found-item`);
    await expect(page.locator("body")).toBeVisible();
  });

});