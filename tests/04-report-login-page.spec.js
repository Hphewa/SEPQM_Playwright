import { test, expect } from '@playwright/test';

/* Check whether the home page opens successfully */
test('Home page loads successfully', async ({ page }) => {
  await page.goto('https://automationexercise.com/', {
    waitUntil: 'domcontentloaded'
  });

  await expect(page).toHaveURL('https://automationexercise.com/');
});

/* Check whether the page title contains Automation Exercise */
test('Page title contains Automation Exercise', async ({ page }) => {
  await page.goto('https://automationexercise.com/', {
    waitUntil: 'domcontentloaded'
  });

  await expect(page).toHaveTitle(/Automation Exercise/i);
});

/* Check whether the page title is not empty */
test('Page title is available', async ({ page }) => {
  await page.goto('https://automationexercise.com/', {
    waitUntil: 'domcontentloaded'
  });

  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});