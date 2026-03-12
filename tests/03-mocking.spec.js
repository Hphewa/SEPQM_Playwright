// Import Playwright testing functions
const { test, expect } = require('@playwright/test');

// Run before each test
test.beforeEach(async ({ request }) => {
  // Reset app data so every test starts fresh
  await request.post('/api/reset');
});

// Test 1: Mock task list
test('should show mocked task list', async ({ page }) => {
  // Intercept requests to /api/tasks
  await page.route('**/api/tasks', async (route) => {
    
    if (route.request().method() === 'GET') {
      // Return fake successful response with 3 mocked tasks
      return route.fulfill({
        status: 200, 
        contentType: 'application/json', // Response type
        body: JSON.stringify([
          { id: 101, title: 'Mock Task 1', completed: false },
          { id: 102, title: 'Mock Task 2', completed: true },
          { id: 103, title: 'Mock Task 3', completed: false }
        ])
      });
    }

    // Allow other requests to continue normally
    return route.continue();
  });

  // Open the application
  await page.goto('/');

  // Verify 3 task items are shown
  await expect(page.getByTestId('task-item')).toHaveCount(3);

  // Verify Mock Task 2 is shown as completed
  await expect(
    page.getByTestId('task-item').filter({ hasText: 'Mock Task 2' }).locator('.task-title')
  ).toHaveClass(/completed/);
});

// Test 2: Mock empty response
test('should show empty state with mocked empty response', async ({ page }) => {
  // Intercept requests to /api/tasks
  await page.route('**/api/tasks', async (route) => {
    
    if (route.request().method() === 'GET') {
      // Return fake successful response with no tasks
      return route.fulfill({
        status: 200, 
        contentType: 'application/json', // Response type
        body: JSON.stringify([]) // Empty task list
      });
    }

    // Allow other requests to continue normally
    return route.continue();
  });

  // Open the application
  await page.goto('/');

  // Verify no task items are shown
  await expect(page.getByTestId('task-item')).toHaveCount(0);

  // Verify empty-state message is shown
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks found');
});

// Test 3: Stub add-task request to fail
test('should show error message when add task API is stubbed to fail', async ({ page }) => {
  // Intercept requests to /api/tasks
  await page.route('**/api/tasks', async (route) => {
    
    if (route.request().method() === 'POST') {
      // Return fake failure response
      return route.fulfill({
        status: 500, 
        contentType: 'application/json', // Response type
        body: JSON.stringify({ message: 'Failed to add task' }) // Error message
      });
    }

    // Allow other requests to continue normally
    return route.continue();
  });

  // Open the application
  await page.goto('/');

  // Type a task into the input field
  await page.getByTestId('task-input').fill('Broken mocked task');

  // Click Add Task button
  await page.getByRole('button', { name: 'Add Task' }).click();

  // Verify error message is shown
  await expect(page.getByTestId('message')).toHaveText('Failed to add task');
});