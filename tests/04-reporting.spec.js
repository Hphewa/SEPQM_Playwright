const { test, expect } = require('./fixtures/base.fixture');

test('report demo - should show steps and attachment in HTML report', async ({
  page,
  taskPage
}) => {
  await test.info().attach('report-note', {
    body: Buffer.from(
      'This attachment is added only to demonstrate Playwright reporting.'
    ),
    contentType: 'text/plain'
  });

  await test.step('Add a reporting task', async () => {
    await taskPage.addTask('Reporting task');
  });

  await test.step('Verify the new task appears', async () => {
    await expect(taskPage.item('Reporting task')).toBeVisible();
  });

  await test.step('Verify page title', async () => {
    await expect(page).toHaveTitle('Mini Task Manager');
  });
});