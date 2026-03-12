//This file proves that your fixture works correctly
const { test, expect } = require('./fixtures/base.fixture');

test('test 1 - should add a temporary task', async ({ taskPage }) => {
  await taskPage.addTask('Temporary fixture task');

  await expect(taskPage.item('Temporary fixture task')).toBeVisible();
  await expect(taskPage.list).toHaveCount(3);
});

test('test 2 - should reset data before the next test', async ({ taskPage }) => {
  await expect(taskPage.item('Temporary fixture task')).toHaveCount(0);
  await expect(taskPage.item('Learn Playwright')).toBeVisible();
  await expect(taskPage.item('Write test cases')).toBeVisible();
  await expect(taskPage.list).toHaveCount(2);
});

test('test 3 - should fail because fixture reset removed temporary task', async ({ taskPage }) => {
  await expect(taskPage.item('Temporary fixture task')).toBeVisible();
});