import { nextTick } from 'vue';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import GcAvatar from '@/components/common/GcAvatar.vue';

const getPublicUrl = vi.hoisted(() => vi.fn((
  path: string,
  options?: { transform?: { width?: number } },
) => ({
  data: {
    publicUrl: options?.transform
      ? `https://cdn.test/t/${path}?w=${options.transform.width}`
      : `https://cdn.test/o/${path}`,
  },
})));

mockNuxtImport('useSupabaseClient', () => () => ({
  storage: {
    from: () => ({ getPublicUrl }),
  },
}));

describe('GcAvatar', () => {
  it('shows initials when there is no image', async () => {
    const wrapper = await mountSuspended(GcAvatar, {
      props: {
        initials: 'SB',
      },
    });

    expect(wrapper.find('img')
      .exists())
      .toBe(false);
    expect(wrapper.text())
      .toContain('SB');
  });

  it('loads a sized transform and falls back to the original on error', async () => {
    const wrapper = await mountSuspended(GcAvatar, {
      props: {
        initials: 'SB',
        size: 'xs',
        url: 'user/avatar.jpg',
      },
    });

    const img = wrapper.find('img');
    expect(img.attributes('src'))
      .toBe('https://cdn.test/t/user/avatar.jpg?w=48');
    expect(img.attributes('width'))
      .toBe('24');
    expect(img.attributes('height'))
      .toBe('24');

    await img.trigger('error');
    await nextTick();
    expect(wrapper.find('img')
      .attributes('src'))
      .toBe('https://cdn.test/o/user/avatar.jpg');
  });
});
