import { expect } from '@nuxt/test-utils/playwright';
import { withSupawright } from 'supawright';
import type { Database } from '@/types';

const test = withSupawright<Database, 'public' | 'storage'>(['public', 'storage']);

test.describe('Closet page smoke', () => {
  test('loads closet with shell chrome', async ({ page }) => {
    await page.goto('/closet', { waitUntil: 'domcontentloaded' });

    await expect(page)
      .toHaveTitle(/Closet/);

    await expect(page.getByTestId('gc-drawer'))
      .toBeVisible();

    // Either a pack is loaded or the empty state is shown — both are success paths.
    const packSummary = page.getByTestId('pack-summary-widget');
    const emptyState = page.getByTestId('closet-empty-state');
    await expect(packSummary.or(emptyState)
      .first())
      .toBeVisible({ timeout: 15_000 });
  });
});
