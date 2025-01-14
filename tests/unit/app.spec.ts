import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VueTippy from 'vue-tippy';
import app from '@/app.vue';
import GcNavbar from '@/components/common/GcNavbar.vue';
import GcNavbarAlt from '@/components/common/GcNavbarAlt.vue';
import GcDrawer from '@/components/common/GcDrawer.vue';
import type { VueWrapper } from '@vue/test-utils';

const { useSupabaseClient } = vi.hoisted(() => {
  return {
    useSupabaseClient: vi.fn()
      .mockImplementation(() => ({
        auth: {
          onAuthStateChange: vi.fn(),
        },
        channel: vi.fn()
          .mockImplementation(() => {
            const channel = {
              on: vi.fn()
                .mockReturnThis(),
              subscribe: vi.fn(),
              unsubscribe: vi.fn(),
            };
            return channel;
          }),
        realtime: {
          removeAllChannels: vi.fn(),
        },
        rpc: vi.fn()
          .mockImplementation(() => {
            return Promise.resolve({ data: {}, error: null });
          }),
        storage: {
          from: () => ({
            getPublicUrl: (url: string) => ({
              data: { publicUrl: url },
            }),
          }),
        },
      })),
  };
});
mockNuxtImport('useSupabaseClient', () => useSupabaseClient);

describe('App', async () => {
  describe('App Component', async () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountSuspended(app, {
        global: {
          plugins: [VueTippy],
        },
      });
    });

    it('calls useSupabaseClient', async () => {
      expect(useSupabaseClient)
        .toHaveBeenCalled();
    });

    it('renders the app', async () => {
      expect(wrapper.exists())
        .toBe(true);
    });
  });

  describe('GcNavbar Component', async () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountSuspended(GcNavbar, {
        global: {
          plugins: [VueTippy],
        },
        props: {
          pageTitle: 'Test Page',
        },
      });
    });

    it('renders the GcNavbar', async () => {
      expect(wrapper.exists())
        .toBe(true);
    });

    it('renders the page title', async () => {
      const pageTitle = wrapper.find('h1');
      expect(pageTitle.exists())
        .toBe(true);
    });
  });

  describe('GcNavbarAlt Component', async () => {
    it('renders the GcNavbarAlt', async () => {
      const wrapper = await mountSuspended(GcNavbarAlt, {
        global: {
          plugins: [VueTippy],
        },
      });
      expect(wrapper.exists())
        .toBe(true);
    });
  });

  describe('GcDrawer Component', async () => {
    it('renders the GcDrawer', async () => {
      const wrapper = await mountSuspended(GcDrawer, {
        global: {
          plugins: [VueTippy],
        },
      });
      expect(wrapper.exists())
        .toBe(true);
    });
  });
});