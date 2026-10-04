import { defineConfig } from '@playwright/test';

/**
 * Browser tests run against already-started servers (no webServer block), so a failure
 * always points at the real process. Start the backend and frontend first (see README).
 *
 * Browser: uses an installed Chromium-family browser via PW_CHANNEL (default: Microsoft Edge).
 * No browser binary is downloaded by this configuration.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5173',
    channel: process.env.PW_CHANNEL ?? 'msedge',
    trace: 'off',
    screenshot: 'only-on-failure',
  },
});
