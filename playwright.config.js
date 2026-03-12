const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  workers: 1,
  retries: 1,

  reporter: [
    ['list'], // terminal report
    ['html', { open: 'never' }], // HTML report
    ['junit', { outputFile: 'test-results/results.xml' }] // XML report
  ],

  globalSetup: require.resolve('./tests/global.setup.js'),
  globalTeardown: require.resolve('./tests/global.teardown.js'),

  use: {
    baseURL: 'http://127.0.0.1:3000',
    headless: true,
    trace: 'on-first-retry', // trace for debugging
    screenshot: 'only-on-failure', // screenshot on failure
    video: 'retain-on-failure', // video on failure
    launchOptions: {
    slowMo: 2000
  }
  }
});