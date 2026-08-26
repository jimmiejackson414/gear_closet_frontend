import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import app from '@/app.vue';
import GcDrawer from '@/components/common/GcDrawer.vue';
import GcNavbar from '@/components/common/GcNavbar.vue';
import GcNavbarAlt from '@/components/common/GcNavbarAlt.vue';
import { useAppStore } from '@/stores/app';
import { testMountGlobals } from '@/tests/unit/helpers';
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
mockNuxtImport('useColorMode', () => () => ({
  value: 'light',
  preference: 'light',
}));

describe('App', async () => {
  afterEach(async () => {
    await vi.dynamicImportSettled();
  });

  describe('App Component', async () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountSuspended(app, {
        global: {
          ...testMountGlobals(),
          stubs: {
            NuxtLayout: true,
            NuxtPage: true,
          },
        },
      });
      await vi.dynamicImportSettled();
    });

    afterEach(() => {
      wrapper.unmount();
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
        global: testMountGlobals(),
        props: {
          pageTitle: 'Test Page',
        },
      });
    });

    afterEach(() => {
      wrapper.unmount();
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

    it('toggles the mobile navigation from the hamburger', async () => {
      const store = useAppStore();
      expect(store.drawer)
        .toBe(false);

      await wrapper.get('[data-testid="nav-menu-button"]')
        .trigger('click');
      expect(store.drawer)
        .toBe(true);
      expect(wrapper.get('[data-testid="nav-menu-button"]')
        .attributes('aria-label'))
        .toBe('Close navigation');
    });

    it('stacks the welcome message below the toolbar on mobile', async () => {
      const nav = wrapper.get('nav');
      expect(nav.classes())
        .toEqual(expect.arrayContaining(['flex-col', 'lg:flex-row']));
      expect(wrapper.get('[data-testid="page-title"]')
        .classes())
        .toEqual(expect.arrayContaining(['lg:order-1']));
      expect(wrapper.get('[data-testid="nav-toolbar"]')
        .classes())
        .toEqual(expect.arrayContaining(['lg:order-2']));
    });
  });

  describe('GcNavbarAlt Component', async () => {
    it('renders the GcNavbarAlt', async () => {
      const wrapper = await mountSuspended(GcNavbarAlt, {
        global: testMountGlobals(),
      });
      expect(wrapper.exists())
        .toBe(true);
    });
  });

  describe('GcDrawer Component', async () => {
    it('renders the GcDrawer', async () => {
      const wrapper = await mountSuspended(GcDrawer, {
        global: testMountGlobals(),
      });
      expect(wrapper.exists())
        .toBe(true);
    });

    it('shows forums as coming soon and does not navigate', async () => {
      const wrapper = await mountSuspended(GcDrawer, {
        global: testMountGlobals(),
      });

      const forumsItems = wrapper.findAll('[aria-label="Forums (coming soon)"]');
      expect(forumsItems.length)
        .toBe(2);
      forumsItems.forEach((item) => {
        expect(item.attributes('aria-disabled'))
          .toBe('true');
        expect(item.attributes('href'))
          .toBeUndefined();
      });
      expect(wrapper.get('[data-testid="gc-drawer-mobile"]')
        .text())
        .toContain('Forums (coming soon)');
      expect(wrapper.find('a[href*="/forums"]')
        .exists())
        .toBe(false);
      expect(wrapper.find('[aria-label="The forums are only available to paid members. Upgrade in Profile."]')
        .exists())
        .toBe(false);
    });

    it('sits off-screen on mobile until opened', async () => {
      const wrapper = await mountSuspended(GcDrawer, {
        global: testMountGlobals(),
      });
      const store = useAppStore();
      const drawer = wrapper.get('[data-testid="gc-drawer-mobile"]');

      expect(store.drawer)
        .toBe(false);
      expect(drawer.classes())
        .toContain('-translate-x-full');

      store.drawer = true;
      await wrapper.vm.$nextTick();
      expect(drawer.classes())
        .toContain('translate-x-0');
      expect(wrapper.find('[data-testid="gc-drawer-backdrop"]')
        .exists())
        .toBe(true);
    });

    it('renders a separate desktop icon rail', async () => {
      const wrapper = await mountSuspended(GcDrawer, {
        global: testMountGlobals(),
      });

      expect(wrapper.find('[data-testid="gc-drawer"]')
        .exists())
        .toBe(true);
      expect(wrapper.find('[data-testid="gc-drawer-mobile"]')
        .exists())
        .toBe(true);
    });

    it('exposes accessible names on navigation and logout controls', async () => {
      const wrapper = await mountSuspended(GcDrawer, {
        global: testMountGlobals(),
      });

      const logoutButtons = wrapper.findAll('[data-testid="logout"]');
      expect(logoutButtons.length)
        .toBe(2);
      logoutButtons.forEach((button) => {
        expect(button.attributes('aria-label'))
          .toBe('Log out');
      });
      expect((logoutButtons[1]!.element as HTMLElement & { _tippy?: { props?: { content?: string } } })._tippy?.props?.content)
        .toBe('Log out');

      const navLinks = wrapper.findAll('a[aria-label], a[href][aria-label]');
      const nuxtLinks = wrapper.findAll('a[aria-label]');
      expect(nuxtLinks.length + navLinks.length)
        .toBeGreaterThan(0);
    });
  });
});