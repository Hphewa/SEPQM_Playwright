import { test, expect } from '@playwright/test';

/* Check whether the login page response is successful */
test('Login page response is OK', async ({ page }) => {
  const response = await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded'
  });

  expect(response).not.toBeNull();
  expect(response.ok()).toBeTruthy();
});

/* Check whether the login page uses HTTPS */
test('Login page uses HTTPS', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded'
  });

  expect(page.url().startsWith('https://')).toBeTruthy();
});

/* Check whether the login URL contains auth path */
test('Login page URL contains auth path', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded'
  });

  expect(page.url()).toContain('/auth/login');
});