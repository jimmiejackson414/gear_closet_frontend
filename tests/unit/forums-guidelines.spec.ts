import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Guidelines from '@/pages/forums/guidelines.vue';

describe('pages/forums/guidelines', () => {
  it('renders community guidelines and a terms link', async () => {
    const wrapper = await mountSuspended(Guidelines);

    expect(wrapper.text())
      .toContain('Forum Guidelines');
    expect(wrapper.text())
      .toContain('Who can post');
    expect(wrapper.get('a[href="/terms-and-conditions"]')
      .text())
      .toContain('Terms and Conditions');
  });
});
