const { test, expect } = require('./fixtures/base.fixture');

// 1. test case - It does not need helper methods like
// This is Playwright’s normal browser page.
/**
 * page.goto('/')

  page.getByRole(...)

  page.getByTestId(...)
 */
test('should load the app with correct title', async ({ page }) => {
 
  //When you step this line, browser goes from about:blank to your app page.
  await page.goto('/'); //browser opens your app
  
  await expect(page).toHaveTitle('Mini Task Manager'); //checks browser tab title
  
  await expect(
    page.getByRole('heading', { name: 'Mini Task Manager' }) //checks visible heading on the page
  ).toBeVisible();
  
});

// 2. test case - It checks that the task list contains exactly 2 items.
test('should show default seeded tasks', async ({ page,taskPage }) => {

  await expect(taskPage.list).toHaveCount(2);

  await expect(taskPage.item('Learn Playwright')).toBeVisible(); //Checks that the task named Learn Playwright is visible on the page.
  
  await expect(taskPage.item('Write test cases')).toBeVisible(); //Checks that the task named Write test cases is visible on the page.
  
});

// 3. test case - It adds a new task and checks that it appears in the list.
test('should add a new task', async ({ page,taskPage }) => {
  
  await taskPage.addTask('Prepare SEPQM demo');
  
  await expect(taskPage.list).toHaveCount(3);
 
  await expect(taskPage.item('Prepare SEPQM demo')).toBeVisible();
  
});

// 4. test case - It marks a task as completed and checks that it is displayed as completed.
test('should mark a task as completed', async ({ page,taskPage }) => {
  
  await taskPage.completeTask('Learn Playwright'); // Learn Playwright is marked as completed.
  
  await expect(
    taskPage.item('Learn Playwright').locator('.task-title')
  ).toHaveClass(/completed/); //This checks whether that task title element now has the CSS class completed
  
});

// 5. test case - It deletes a task and checks that it is removed from the list.
test('should delete a task', async ({ page,taskPage }) => {
  
  await taskPage.deleteTask('Learn Playwright');
  
  await expect(taskPage.item('Learn Playwright')).toHaveCount(0); //toHaveCount(0) verifies that zero matching elements exist.
  
  await expect(taskPage.list).toHaveCount(1);
  
});

// 6. test case - It tries to add a task without a title and checks that an error message is displayed and no new task is added.
test('should validate empty task input', async ({ page, taskPage }) => {
  
  await page.getByRole('button', { name: 'Add Task' }).click();
  
  await expect(page.getByTestId('message')).toHaveText('Task title is required');
  
  await expect(taskPage.list).toHaveCount(2);
  
});

// 7. test case - It marks a task as completed and then undoes it, checking that the task is no longer marked as completed.
test('should undo a completed task', async ({ taskPage }) => {
  await taskPage.completeTask('Learn Playwright');

  await taskPage
    .item('Learn Playwright')
    .getByRole('button', { name: /Undo Learn Playwright/i }) // find the Undo button for that task
    .click();

  await expect(
    taskPage.item('Learn Playwright').locator('.task-title')
  ).not.toHaveClass(/completed/); // checks that the task title element no longer has the CSS class completed

  await expect(
    taskPage.item('Learn Playwright').getByRole('button', {
      name: /Complete Learn Playwright/i  // i - case-insensitive , checks that the Complete button is visible again for that task
    })
  ).toBeVisible();
});