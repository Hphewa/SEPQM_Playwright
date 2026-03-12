const { test: base, expect } = require('@playwright/test');

//it protects special characters so they are treated as normal text.
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//You are extending Playwright’s normal test and adding a new fixture called taskPage.
const test = base.extend({
  taskPage: async ({ page, request }, use) => {
    const resetResponse = await request.post('/api/reset'); //Reset app data before each test

    if (!resetResponse.ok()) {
      throw new Error('Could not reset tasks before test.');
    }

    await page.goto('/'); //Open the app page - / means - http://127.0.0.1:3000/

    // Create the taskPage helper object
    const taskPage = {
      list: page.getByTestId('task-item'),

      //use for Finds one specific task item by its text.
      item: (title) =>
        page.getByTestId('task-item').filter({ hasText: title }),

      //It performs the steps needed to add a task.
      addTask: async (title) => {
        await page.getByTestId('task-input').fill(title);
        await page.getByRole('button', { name: 'Add Task' }).click();
      },

      completeTask: async (title) => {
        await taskPage
          .item(title) // This finds the task item with that title. like: Learn Playwright
          .getByRole('button', { //Inside that task row, find a button.
            name: new RegExp(`Complete ${escapeRegExp(title)}`, 'i') // find a button whose name matches text like: Complete Learn Playwright
          })
          .click(); // Click that button.
      },
      // Why new RegExp(...)? Because button name changes depending on task title.
      //'i' means case-insensitive.

      deleteTask: async (title) => {
        await taskPage
          .item(title)
          .getByRole('button', {
            name: new RegExp(`Delete ${escapeRegExp(title)}`, 'i')
          })
          .click();
      }
    };

    await use(taskPage);
  }
});

module.exports = { test, expect };