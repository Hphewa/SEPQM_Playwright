import { test, expect } from '@playwright/test';

/* Check whether the login page opens successfully */
test('Login page loads successfully', async ({ page }) => {
  await page.goto('https://automationexercise.com/login', {
    waitUntil: 'domcontentloaded'
  });

  await expect(page).toHaveURL(/login/);
});

/* Check whether the login page title is available */
test('Login page title is available', async ({ page }) => {
  await page.goto('https://automationexercise.com/login', {
    waitUntil: 'domcontentloaded'
  });

  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});

/* Check whether the login page uses HTTPS */
test('Login page uses HTTPS', async ({ page }) => {
  await page.goto('https://automationexercise.com/login', {
    waitUntil: 'domcontentloaded'
  });

  expect(page.url().startsWith('https://')).toBeTruthy();
});