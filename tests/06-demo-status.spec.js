const { test, expect } = require('./fixtures/base.fixture');

test('demo flaky - should pass on retry', async ({ taskPage }) => {
  const retry = test.info().retry;

  // fail on the first run 
  if (retry === 0) {
    await expect(taskPage.list).toHaveCount(3);
  }

  // pass on retry to appear as flaky
  await expect(taskPage.list).toHaveCount(2);
});

test.skip('demo skipped - should be skipped in report', async ({ taskPage }) => {
  // skipped intentionally to appear in report
  await expect(taskPage.list).toHaveCount(2);
});