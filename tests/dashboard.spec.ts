import { expect } from '@playwright/test';
import { withSupawright } from 'supawright';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import type { Database } from '@/types';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const forumPosts = JSON.parse(await fs.readFile(path.resolve(dirname, '../mocks/forumPosts.json'), 'utf-8'));

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

  test('displays the friends widget', async ({ page }) => {
    const widget = await page.waitForSelector('[data-testid="friends-widget"]');
    expect(widget)
      .toBeDefined();
  });

  test('displays the invitations widget', async ({ page }) => {
    const widget = await page.waitForSelector('[data-testid="invitations-widget"]');
    expect(widget)
      .toBeDefined();
  });

  test('displays the forums widget', async ({ page }) => {
    // mock the API response
    await page.route('**/api/forumPosts', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(forumPosts),
      });
    });

    const widget = await page.waitForSelector('[data-testid="forums-widget"]');
    expect(widget)
      .toBeDefined();
  });

  test('displays the correct number of items in the drawer', async ({ page }) => {
    const drawer = page.getByTestId('gc-drawer');
    const items = drawer.locator('li');
    expect(await items.count())
      .toBe(8);
  });

  test('displays the notifications dropdown and at least one notification', async ({ page }) => {
    const notificationsButton = page.locator('[data-testid="notifications-button"]');
    await notificationsButton.click();

    await page.waitForTimeout(500);

    await page.waitForSelector('[data-testid="notifications-dropdown"]');
    const notificationsDropdown = page.locator('[data-testid="notifications-dropdown"]');

    const notifications = notificationsDropdown.locator('li');
    expect(await notifications.count())
      .toBeGreaterThan(0);
  });
});