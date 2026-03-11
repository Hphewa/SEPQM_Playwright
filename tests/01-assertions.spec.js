const { test, expect } = require('./fixtures/base.fixture');

test('should load the app with correct title', async ({ page }) => {
  await expect(page).toHaveTitle('Mini Task Manager');
  await expect(
    page.getByRole('heading', { name: 'Mini Task Manager' })
  ).toBeVisible();
});

test('should show default seeded tasks', async ({ taskPage }) => {
  await expect(taskPage.list).toHaveCount(2);
  await expect(taskPage.item('Learn Playwright')).toBeVisible();
  await expect(taskPage.item('Write test cases')).toBeVisible();
});

test('should add a new task', async ({ taskPage }) => {
  await taskPage.addTask('Prepare SEPQM demo');

  await expect(taskPage.list).toHaveCount(3);
  await expect(taskPage.item('Prepare SEPQM demo')).toBeVisible();
});

test('should mark a task as completed', async ({ taskPage }) => {
  await taskPage.completeTask('Learn Playwright');

  await expect(
    taskPage.item('Learn Playwright').locator('.task-title')
  ).toHaveClass(/completed/);
});

test('should delete a task', async ({ taskPage }) => {
  await taskPage.deleteTask('Learn Playwright');

  await expect(taskPage.item('Learn Playwright')).toHaveCount(0);
  await expect(taskPage.list).toHaveCount(1);
});

test('should validate empty task input', async ({ page, taskPage }) => {
  await page.getByRole('button', { name: 'Add Task' }).click();

  await expect(page.getByTestId('message')).toHaveText('Task title is required');
  await expect(taskPage.list).toHaveCount(2);
});