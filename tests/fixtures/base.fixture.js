const { test: base, expect } = require('@playwright/test');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const test = base.extend({
  taskPage: async ({ page, request }, use) => {
    const resetResponse = await request.post('/api/reset');

    if (!resetResponse.ok()) {
      throw new Error('Could not reset tasks before test.');
    }

    await page.goto('/');

    const taskPage = {
      list: page.getByTestId('task-item'),

      item: (title) =>
        page.getByTestId('task-item').filter({ hasText: title }),

      addTask: async (title) => {
        await page.getByTestId('task-input').fill(title);
        await page.getByRole('button', { name: 'Add Task' }).click();
      },

      completeTask: async (title) => {
        await taskPage
          .item(title)
          .getByRole('button', {
            name: new RegExp(`Complete ${escapeRegExp(title)}`, 'i')
          })
          .click();
      },

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