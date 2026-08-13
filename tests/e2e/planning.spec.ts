import { expect } from '@nuxt/test-utils/playwright';
import { withSupawright } from 'supawright';
import type { Database } from '@/types';

const test = withSupawright<Database, 'public' | 'storage'>(['public', 'storage']);

test.describe('Planning page smoke', () => {
  test('loads planning with shell chrome', async ({ page }) => {
    await page.goto('/planning', { waitUntil: 'domcontentloaded' });

    await expect(page)
      .toHaveTitle(/Planning/);

    await expect(page.getByTestId('gc-drawer'))
      .toBeVisible();
  });
});
