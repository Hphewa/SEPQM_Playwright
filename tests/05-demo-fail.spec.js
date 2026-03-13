const { test, expect } = require('./fixtures/base.fixture');

test('demo fail - should incorrectly expect 3 seeded tasks', async ({ taskPage }) => {
  await expect(taskPage.list).toHaveCount(3);
});