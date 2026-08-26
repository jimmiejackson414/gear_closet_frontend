import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from '@nuxt/test-utils/playwright';
import { withSupawright } from 'supawright';
import type { Database } from '@/types';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const forumPosts = JSON.parse(await fs.readFile(path.resolve(dirname, './mocks/forumPosts.json'), 'utf-8'));
const emptyState = JSON.parse(await fs.readFile(path.resolve(dirname, './mocks/emptyDashboardState.json'), 'utf-8'));
// const populatedState = JSON.parse(await fs.readFile(path.resolve(dirname, './mocks/populatedDashboardState.json'), 'utf-8'));

const test = withSupawright<Database, 'public' | 'storage'>(['public', 'storage']);

test.describe('Dashboard', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('has dashboard title', async ({ page }) => {
    await expect(page)
      .toHaveTitle(/Dashboard | Gear Closet/);

    await expect(page.locator('[data-testid="page-title"] h1'))
      .toHaveText('Dashboard');
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
        body: JSON.stringify(forumPosts),
        contentType: 'application/json',
        status: 200,
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

  // test('displays the notifications dropdown and at least one notification', async ({ page }) => {
  //   const notificationsButton = page.locator('[data-testid="notifications-button"]');

  //   await notificationsButton.click();

  //   await page.waitForSelector('[data-testid="notifications-dropdown"]');

  //   const notificationsDropdown = page.locator('[data-testid="notifications-dropdown"]');
  //   const notifications = notificationsDropdown.locator('li');
  //   const notificationCount = await notifications.count();
  //   expect(notificationCount)
  //     .toBeGreaterThan(0);
  // });

  test('displays empty state for all widgets correctly', async ({ page }) => {
    // page.on('console', log => {
    //   console.log(log.text());
    // });

    // page.on('request', request => {
    //   console.log('request url');
    //   if (!request.url()
    //     .includes('/_nuxt/')) {
    //     console.log('>>', request.url(), request.method());
    //   }
    // });

    // mock the API response
    await page.route('**/rest/v1/rpc/get_dashboard_data', async route => {
      const json = JSON.stringify(emptyState);
      await route.fulfill({ json });
    });

    const upcomingTripsWidget = page.getByTestId('upcoming-trips-widget');
    expect(await upcomingTripsWidget.textContent())
      .toContain('Upcoming Trips (0)');
    expect(await upcomingTripsWidget.textContent())
      .toContain('You don\'t have any upcoming trips yet!');

    const friendsWidget = page.getByTestId('friends-widget');
    expect(await friendsWidget.textContent())
      .toContain('You haven\'t connected with any friends yet!');

    const invitationsWidget = page.getByTestId('invitations-widget');
    expect(await invitationsWidget.textContent())
      .toContain('You don\'t currently have any pending invitations.');
  });
});