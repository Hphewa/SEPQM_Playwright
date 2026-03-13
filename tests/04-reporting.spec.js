const { test, expect } = require('./fixtures/base.fixture');

test('report demo - should show steps and attachment in HTML report', async ({
  page,
  taskPage
}) => {
  //add an attachment as extra report evidence
  await test.info().attach('report-note', { // add extra evidence to the report
    body: Buffer.from(
      'This attachment is added only to demonstrate Playwright reporting.'
    ),
    contentType: 'text/plain'
  });

  //to show detailed execution steps in the HTML report
  await test.step('Add a reporting task', async () => { // record task creation as a report step
    await taskPage.addTask('Reporting task');
  });

  await test.step('Verify the new task appears', async () => { // record visibility check in the report
    await expect(taskPage.item('Reporting task')).toBeVisible();
  });

  await test.step('Verify page title', async () => { // record title validation in the report
    await expect(page).toHaveTitle('Mini Task Manager');
  });
});