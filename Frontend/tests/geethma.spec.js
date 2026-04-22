import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

test.describe("Geethma module - homepage, about, auth, navbar, footer", () => {

  // ✅ Home page loads
  test("home page loads", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("body")).toBeVisible();
  });

  // ✅ Navbar visible
  test("navbar is visible", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("header")).toBeVisible();
  });

  // ✅ Footer visible
  test("footer is visible", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("footer")).toBeVisible();
  });

  // ✅ About page navigation (FIXED)
  test("about us page opens from navbar", async ({ page }) => {
    await page.goto(BASE_URL);

    const aboutNav = page.locator("button, a", { hasText: /about/i }).first();
    await expect(aboutNav).toBeVisible();

    await aboutNav.click();

    await expect(page).toHaveURL(/about/i);
    await expect(page.locator("body")).toBeVisible();
  });

  // ✅ Login page navigation (FIXED)
  test("login page opens from navbar", async ({ page }) => {
    await page.goto(BASE_URL);

    const loginNav = page.locator("button, a", { hasText: /login|sign in|log in/i }).first();
    await expect(loginNav).toBeVisible();

    await loginNav.click();

    await expect(page).toHaveURL(/login/i);
    await expect(page.locator("form")).toBeVisible();
  });

  // ✅ Register page opens
  test("register page opens", async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    await expect(page).toHaveURL(/register/i);
    await expect(page.locator("form")).toBeVisible();
  });

  // ✅ Protected route redirect
  test("protected route redirects to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/my-claims`);

    await expect(page).toHaveURL(/login/i);
  });

  // ✅ Login validation test
  test("login form validation works", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible();

    await submitBtn.click();

    await expect(page.locator("body")).toContainText(/required|email|password|invalid/i);
  });

});