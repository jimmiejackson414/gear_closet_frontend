import VueTippy from 'vue-tippy';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '@/app.vue';
import GcDrawer from '@/components/common/GcDrawer.vue';
import GcNavbar from '@/components/common/GcNavbar.vue';
import GcNavbarAlt from '@/components/common/GcNavbarAlt.vue';
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
            getPublicUrl: (url: string, _options?: unknown) => ({
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

    it('keeps the notifications panel inside the viewport on small screens', async () => {
      await wrapper.find('[data-testid="notifications-button"]')
        .trigger('click');

      const dropdown = wrapper.find('[data-testid="notifications-dropdown"]');
      expect(dropdown.exists())
        .toBe(true);
      expect(dropdown.classes()
        .join(' '))
        .toContain('calc(100vw-5.5rem)');
    });

    it('exposes accessible names on icon-only controls', async () => {
      const notificationsButton = wrapper.find('[data-testid="notifications-button"]');
      expect(notificationsButton.attributes('aria-label'))
        .toBe('Open notifications');

      const themeToggle = wrapper.findAll('button')
        .find((btn) => Boolean(btn.attributes('aria-label')
          ?.includes('Switch to')));
      expect(themeToggle?.attributes('aria-label'))
        .toMatch(/Switch to (light|dark) mode/);
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

    it('routes the locked forums item to Profile subscription', async () => {
      const wrapper = await mountSuspended(GcDrawer, {
        global: {
          plugins: [VueTippy],
        },
      });

      const forumsLink = wrapper.get('[aria-label="The forums are only available to paid members. Upgrade in Profile."]');
      expect(forumsLink.attributes('href'))
        .toContain('/profile');
      expect(forumsLink.attributes('href'))
        .toContain('tab=subscription');
    });

    it('exposes accessible names on navigation and logout controls', async () => {
      const wrapper = await mountSuspended(GcDrawer, {
        global: {
          plugins: [VueTippy],
        },
      });

      const logoutButton = wrapper.find('[data-testid="logout"]');
      expect(logoutButton.attributes('aria-label'))
        .toBe('Log out');

      const navLinks = wrapper.findAll('a[aria-label], a[href][aria-label]');
      const nuxtLinks = wrapper.findAll('a[aria-label]');
      expect(nuxtLinks.length + navLinks.length)
        .toBeGreaterThan(0);
    });
  });
});