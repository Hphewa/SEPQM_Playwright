const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ request }) => {
  await request.post('/api/reset');
});

test('should show mocked task list', async ({ page }) => {
  await page.route('**/api/tasks', async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 101, title: 'Mock Task 1', completed: false },
          { id: 102, title: 'Mock Task 2', completed: true },
          { id: 103, title: 'Mock Task 3', completed: false }
        ])
      });
    }

    return route.continue();
  });

  await page.goto('/');

  await expect(page.getByTestId('task-item')).toHaveCount(3);
  await expect(
    page.getByTestId('task-item').filter({ hasText: 'Mock Task 2' }).locator('.task-title')
  ).toHaveClass(/completed/);
});

test('should show empty state with mocked empty response', async ({ page }) => {
  await page.route('**/api/tasks', async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    }

    return route.continue();
  });

  await page.goto('/');

  await expect(page.getByTestId('task-item')).toHaveCount(0);
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks found');
});

test('should show error message when add task API is stubbed to fail', async ({ page }) => {
  await page.route('**/api/tasks', async (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Failed to add task' })
      });
    }

    return route.continue();
  });

  await page.goto('/');

  await page.getByTestId('task-input').fill('Broken mocked task');
  await page.getByRole('button', { name: 'Add Task' }).click();

  await expect(page.getByTestId('message')).toHaveText('Failed to add task');
});