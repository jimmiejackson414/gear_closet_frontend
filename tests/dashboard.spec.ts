import { test, expect } from '@playwright/test';

test.describe('Dashboard', async () => {
  test('has welcome message', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page)
      .toHaveTitle(/Dashboard | Gear Closet/);

    // Wait for the welcome message to be rendered
    await page.waitForFunction(() => {
      const welcomeMessageElement = document.querySelector('[data-testid="welcome-message"]');
      return welcomeMessageElement && welcomeMessageElement.textContent?.includes('Jimmie');
    }, { timeout: 1000 });

    // Expect a heading "to contain" a substring.
    const welcomeMessage = await page.locator('[data-testid="welcome-message"]')
      .textContent();
    expect(welcomeMessage)
      .toMatch(/(Hello|Welcome|Hey), Jimmie!/);
  });

  test('displays the upcoming trips widget', async ({ page }) => {

  });

  test('displays the friends widget', async ({ page }) => {

  });

  test('displays the invitations widget', async ({ page }) => {

  });

  test('displays the forums widget', async ({ page }) => {

  });
});