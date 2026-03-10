// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright test configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Allow enough time for each test */
  timeout: 30000,

  /* Run test files in parallel */
  fullyParallel: true,

  /* Prevent accidental test.only in CI */
  forbidOnly: !!process.env.CI,

  /* Retry only in CI, otherwise no retries */
  retries: process.env.CI ? 2 : 0,

  /* Use one worker in CI for stability */
  workers: process.env.CI ? 1 : undefined,

  /* Show terminal output and generate HTML report */
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  /* Shared settings for test execution */
  use: {
    /* Show browser while tests run */
    headless: false,

    /* Save screenshot only when a test fails */
    screenshot: 'only-on-failure',

    /* Keep video only when a test fails */
    video: 'retain-on-failure',

    /* Collect trace on first retry */
    trace: 'on-first-retry',
  },

  /* Run tests only in Chromium for reporting demo */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});