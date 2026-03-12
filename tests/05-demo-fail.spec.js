const { test, expect } = require('./fixtures/base.fixture');

test('demo fail - should incorrectly expect 3 seeded tasks', async ({ taskPage }) => {
  await expect(taskPage.list).toHaveCount(3); // intentional fail
});

test('demo flaky - should pass on retry', async ({ taskPage }) => {
  const retry = test.info().retry;

  //a flaky test can be shown by making it fail on the first run and pass on retry
  if (retry === 0) {
    await expect(taskPage.list).toHaveCount(3); // fail on first run
  }

  await expect(taskPage.list).toHaveCount(2); // pass on retry
});

test.skip('demo skipped - should be skipped in report', async ({ taskPage }) => {
  await expect(taskPage.list).toHaveCount(2); // skipped on purpose
});