import { test, expect } from '@playwright/test';

/* Check whether the home page response is successful */
test('Home page response is OK', async ({ page }) => {
  const response = await page.goto('https://automationexercise.com/', {
    waitUntil: 'domcontentloaded'
  });

  expect(response).not.toBeNull();
  expect(response.ok()).toBeTruthy();
});

/* Check whether the home page uses HTTPS */
test('Home page uses HTTPS', async ({ page }) => {
  await page.goto('https://automationexercise.com/', {
    waitUntil: 'domcontentloaded'
  });

  expect(page.url().startsWith('https://')).toBeTruthy();
});

/* Check whether the home page URL is correct */
test('Home page URL is correct', async ({ page }) => {
  await page.goto('https://automationexercise.com/', {
    waitUntil: 'domcontentloaded'
  });

  expect(page.url()).toBe('https://automationexercise.com/');
});