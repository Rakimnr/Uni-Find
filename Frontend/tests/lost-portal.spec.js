import { test, expect } from '@playwright/test';

// Replace these with your real test account credentials
const USER_EMAIL = 'rakindur03@gmail.com';
const USER_PASSWORD = 'Rakindu12#';

async function loginAsUser(page) {
  await page.goto('/login');

  await page.getByPlaceholder(/email/i).fill(USER_EMAIL);
  await page.getByPlaceholder(/password/i).fill(USER_PASSWORD);

  await page.locator('form').getByRole('button', { name: /sign in/i }).click();
  await page.waitForLoadState('networkidle');
}

test.describe('Lost Portal - User Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  test('TC01 - lost items catalog page loads', async ({ page }) => {
    await page.goto('/lost-items');
    await expect(
      page.getByRole('heading', { name: /lost items catalog/i })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /view report/i }).first()
    ).toBeVisible();
  });

  test('TC02 - search works in lost items catalog', async ({ page }) => {
    await page.goto('/lost-items');

    const searchBox = page.getByPlaceholder(/search by item name, location/i);
    await searchBox.fill('TVS');

    await expect(page.getByText(/tvs bike key/i)).toBeVisible();
  });

  test('TC03 - user can open lost item details page', async ({ page }) => {
    await page.goto('/lost-items');

    await page.getByRole('button', { name: /view report/i }).first().click();

    await page.waitForURL(/\/lost-reports\/.+/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /contact owner/i })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByRole('heading', { name: /description/i })
    ).toBeVisible();
  });

  test('TC04 - user can open my lost reports page', async ({ page }) => {
    await page.goto('/lost-reports');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /manage your lost item reports/i })
    ).toBeVisible();
  });

  test('TC05 - search works in my lost reports page', async ({ page }) => {
  await page.goto('/lost-reports');
  await page.waitForLoadState('networkidle');

  await expect(
    page.getByRole('heading', { name: /manage your lost item reports/i })
  ).toBeVisible();

  const searchBox = page.getByPlaceholder(/search your lost reports/i);
  await searchBox.fill('zzzzzz_no_match_123');

  await expect(
    page.getByRole('heading', { name: /no lost reports found/i })
  ).toBeVisible();

  await expect(
    page.getByText(/you do not have any matching lost reports right now/i)
  ).toBeVisible();

  await page.getByRole('button', { name: /clear filters/i }).click();

  await expect(
    page.getByRole('heading', { name: /manage your lost item reports/i })
  ).toBeVisible();
});
});