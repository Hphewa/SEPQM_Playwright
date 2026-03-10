import { test, expect } from '@playwright/test';

/* Check whether the login page opens successfully */
test('Login page loads successfully', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded'
  });

  await expect(page).toHaveURL(/login/);
});

/* Check whether the page title contains OrangeHRM */
test('Page title contains OrangeHRM', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded'
  });

  await expect(page).toHaveTitle(/OrangeHRM/i);
});

/* Check whether the page title is not empty */
test('Page title is available', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded'
  });

  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});