const { test, expect } = require('@playwright/test');

test('mock employee API response', async ({ page }) => {
  // Intercept the API request and return fake data
  await page.route('https://example.com/api/employee', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'John Silva',
        role: 'HR Assistant'
      })
    });
  });

  // Create a small demo page
  await page.setContent(`
    <button id="loadBtn">Load Employee</button>
    <div id="result"></div>

    <script>
      document.getElementById('loadBtn').addEventListener('click', async () => {
        const response = await fetch('https://example.com/api/employee');
        const data = await response.json();
        document.getElementById('result').textContent = data.name + ' - ' + data.role;
      });
    </script>
  `);

  // Click the button
  await page.getByRole('button', { name: 'Load Employee' }).click();

  // Verify result inside the div
  await expect(page.locator('#result')).toHaveText('John Silva - HR Assistant');
});