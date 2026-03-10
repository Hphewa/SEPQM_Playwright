import { test, expect } from '@playwright/test';

/* Check whether forgot password page opens directly */
test('Forgot password page loads successfully', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode', {
    waitUntil: 'domcontentloaded'
  });

  await expect(page).toHaveURL(/requestPasswordResetCode/);
});

/* Check whether forgot password page title is available */
test('Forgot password page title is available', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode', {
    waitUntil: 'domcontentloaded'
  });

  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});

/* Check whether forgot password page uses HTTPS */
test('Forgot password page uses HTTPS', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode', {
    waitUntil: 'domcontentloaded'
  });

  expect(page.url().startsWith('https://')).toBeTruthy();
});