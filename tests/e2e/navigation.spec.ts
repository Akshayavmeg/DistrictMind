import { expect, test, type Page } from '@playwright/test';

/**
 * Development flows: login → districts → district detail, direct navigation, invalid ids,
 * plus the Step 1 checks (home, login redirect, unknown route, request loop).
 * Asserts real rendered text from the live backend. Fails on any console error.
 */

function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return errors;
}

async function enterDevelopmentSession(page: Page) {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Enter development session' }).click();
  await expect(page).toHaveURL(/\/districts$/);
}

test.beforeEach(async ({ page }) => {
  // Start every test without a development session.
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
});

test('home page shows the product title and live backend status', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'DistrictMind' })).toBeVisible();
  await expect(page.getByText('Telangana District Intelligence').first()).toBeVisible();
  await expect(page.getByText(/Backend: ONLINE/)).toBeVisible();
  expect(errors).toEqual([]);
});

test('district pages require the development login and redirect to /login', async ({ page }) => {
  await page.goto('/districts');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Enter development session' })).toBeVisible();
  await expect(page.getByText('DEVELOPMENT LOGIN', { exact: true })).toBeVisible();
});

test('flow 1: login, district list loads from the backend, click Warangal, detail loads', async ({
  page,
}) => {
  const errors = trackConsoleErrors(page);

  await enterDevelopmentSession(page);
  await expect(page.getByRole('heading', { name: 'Telangana District Intelligence' })).toBeVisible();
  await expect(page.getByText('33 districts · administrative reference')).toBeVisible();
  const list = page.getByRole('list', { name: 'Districts' });
  await expect(list.getByRole('listitem')).toHaveCount(33);

  await list.getByRole('link', { name: /^Warangal/ }).click();
  await expect(page).toHaveURL(/\/districts\/telangana-warangal$/);
  await expect(page.getByRole('heading', { name: 'Warangal' })).toBeVisible();
  await expect(page.getByText('Telangana', { exact: true })).toBeVisible();
  await expect(page.getByText('Active', { exact: true })).toBeVisible();
  await expect(page.getByText('Not available — validated GIS layer not yet connected.')).toBeVisible();

  expect(errors).toEqual([]);
});

test('flow 2: direct navigation to /districts/telangana-warangal loads the detail', async ({ page }) => {
  const errors = trackConsoleErrors(page);

  await enterDevelopmentSession(page);
  await page.goto('/districts/telangana-warangal');
  await expect(page.getByRole('heading', { name: 'Warangal' })).toBeVisible();
  await expect(page.getByText('telangana-warangal', { exact: true })).toBeVisible();

  expect(errors).toEqual([]);
});

test('flow 3: an unknown district id shows the not-found state', async ({ page }) => {
  const errors = trackConsoleErrors(page);

  await enterDevelopmentSession(page);
  await page.goto('/districts/telangana-atlantis');
  await expect(page.getByText('District not found')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Warangal' })).toHaveCount(0);

  // A structurally invalid id is a different state: 400, not 404.
  await page.goto('/districts/Telangana-Warangal');
  await expect(page.getByText('Invalid district reference')).toBeVisible();

  // Browser-level 4xx responses are expected for these two deliberate checks, nothing else.
  const unexpected = errors.filter(
    (text) => !/Failed to load resource: the server responded with a status of (400|404)/.test(text),
  );
  expect(unexpected).toEqual([]);
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
