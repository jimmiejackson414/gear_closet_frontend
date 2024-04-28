import { expect } from '@playwright/test';
import { withSupawright } from 'supawright';
import type { Database } from '@/types';

const test = withSupawright<Database, 'public' | 'storage'>(['public', 'storage']);

test.describe('Dashboard', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has welcome message', async ({ page, supawright }) => {
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
    const widget = await page.waitForSelector('[data-testid="upcoming-trips-widget"]');
    expect(widget)
      .toBeDefined();
  });

  // test('displays the friends widget', async ({ page }) => {

  // });

  // test('displays the invitations widget', async ({ page }) => {

  // });

  // test('displays the forums widget', async ({ page }) => {

  // });
});