import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

test.describe("Hashini module - found tab, dashboards, and found item management", () => {
  test("home page loads", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("body")).toBeVisible();
  });

  test("found items page opens", async ({ page }) => {
    await page.goto(`${BASE_URL}/found-items`);
    await expect(page.locator("body")).toBeVisible();
  });

  test("found items content exists", async ({ page }) => {
    await page.goto(`${BASE_URL}/found-items`);

    const content = page.locator("button, a, div").first();
    await expect(content).toBeVisible();
  });

  test("report found item page opens", async ({ page }) => {
    await page.goto(`${BASE_URL}/report-found-item`);
    await expect(page.locator("body")).toBeVisible();
  });

  test("report found item page has form fields", async ({ page }) => {
    await page.goto(`${BASE_URL}/report-found-item`);

    const formField = page.locator("input, textarea, select").first();
    await expect(formField).toBeVisible();
  });

  test("user dashboard route redirects unauthenticated user to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(/login/i);
  });

  test("my claims route redirects unauthenticated user to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/my-claims`);
    await expect(page).toHaveURL(/login/i);
  });

  test("admin dashboard route redirects unauthenticated user to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).toHaveURL(/login/i);
  });

  test("admin found items route redirects unauthenticated user to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/found-items`);
    await expect(page).toHaveURL(/login/i);
  });

  test("found-related navigation exists on site", async ({ page }) => {
    await page.goto(BASE_URL);

    const foundNav = page.locator("button, a").filter({ hasText: /found/i }).first();

    if (await foundNav.count()) {
      await expect(foundNav).toBeVisible();
    }
  });

  test("report/add item navigation exists on site", async ({ page }) => {
    await page.goto(BASE_URL);

    const reportNav = page
      .locator("button, a")
      .filter({ hasText: /report|add item|found item/i })
      .first();

    if (await reportNav.count()) {
      await expect(reportNav).toBeVisible();
    }
  });

  test("found item action button exists if available", async ({ page }) => {
    await page.goto(`${BASE_URL}/found-items`);

    const actionButton = page
      .locator("button, a")
      .filter({ hasText: /claim|view|details/i })
      .first();

    if (await actionButton.count()) {
      await expect(actionButton).toBeVisible();
    }
  });
});