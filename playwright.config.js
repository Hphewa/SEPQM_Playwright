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

  /* Show terminal output + generate HTML report */
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  /* Shared settings for all browsers */
  use: {
    /* Show browser during execution */
    headless: false,

    /* Capture screenshot only if a test fails */
    screenshot: 'only-on-failure',

    /* Keep video only if a test fails */
    video: 'retain-on-failure',

    /* Collect trace on first retry */
    trace: 'on-first-retry',
  },

  /* Browser projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});