import { expect, test } from '@playwright/test';

/**
 * Development scaffold flow: /login → /districts → /districts/:id, plus unknown route.
 * Asserts real rendered text. Collects console errors to catch runtime failures.
 */

test.beforeEach(async ({ page }) => {
  // Start every test without a development session.
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
});

test('home page shows the product title and live backend status', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'DistrictMind' })).toBeVisible();
  await expect(page.getByText('Telangana District Intelligence').first()).toBeVisible();
  await expect(page.getByText(/Backend: ONLINE/)).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('district pages require the development login and redirect to /login', async ({ page }) => {
  await page.goto('/districts');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Enter development session' })).toBeVisible();
  await expect(page.getByText('DEVELOPMENT LOGIN', { exact: true })).toBeVisible();
});

test('development login navigates to /districts and shows the pending-data state', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Enter development session' }).click();
  await expect(page).toHaveURL(/\/districts$/);
  await expect(page.getByRole('heading', { name: 'Telangana District Intelligence' })).toBeVisible();
  await expect(page.getByText('District data integration pending')).toBeVisible();
});

test('district detail route renders the requested reference without inventing data', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Enter development session' }).click();
  await expect(page).toHaveURL(/\/districts$/);

  await page.goto('/districts/example-ref-001');
  await expect(page.getByRole('heading', { name: 'District dashboard' })).toBeVisible();
  await expect(page.getByText('example-ref-001')).toBeVisible();
  await expect(page.getByText('District data integration pending')).toBeVisible();
});

test('unknown routes show the not-found state', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('health is not polled in a loop', async ({ page }) => {
  let healthRequests = 0;
  page.on('request', (req) => {
    if (req.url().includes('/api/v1/health')) healthRequests += 1;
  });
  await page.goto('/');
  await expect(page.getByText(/Backend: ONLINE/)).toBeVisible();
  await page.waitForTimeout(3000);
  // React StrictMode mounts effects twice in development, so two requests are expected. More means a loop.
  expect(healthRequests).toBeLessThanOrEqual(2);
});
