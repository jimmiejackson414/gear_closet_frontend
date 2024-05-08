import { mountSuspended } from '@nuxt/test-utils/runtime';
import type { VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VueTippy from 'vue-tippy';
import { createTestingPinia } from '@pinia/testing';
import Closet from '@/pages/closet.vue';
import { useClosetStore } from '@/stores/closet';

vi.mock('vue-echarts', () => ({
  ECharts: {
    render: () => {},
    mounted: () => {},
  },
}));

describe('Closet Page', async () => {
  let wrapper: VueWrapper<any>;
  beforeEach(async () => {
    wrapper = await mountSuspended(Closet, {
      global: {
        plugins: [VueTippy, createTestingPinia({
          initialState: {
            data: {
              selectedPack: undefined,
              allPacks: [],
            },
            pageLoading: false,
          },
        })],
      },
    });
  });

  describe('Settings', async () => {
    it('renders the available packs in the list correctly', async () => {
      const store = useClosetStore();
      const allPacks = [
        { id: 1, name: 'Pack 1', slug: 'pack-1' },
        { id: 2, name: 'Pack 2', slug: 'pack-2' },
        { id: 3, name: 'Pack 3', slug: 'pack-3' },
      ];

      store.$patch({ data: { allPacks }});
      await wrapper.vm.$nextTick();
      const select = wrapper.findComponent({ name: 'GcSelect' });
      const transformedAllPacks = allPacks.map(p => ({ label: p.name, value: p.id }));

      expect(select.exists())
        .toBe(true);
      expect(select.props('options'))
        .toEqual(transformedAllPacks);
    });

    it('renders the options icon correctly', async () => {
      const settingsIcon = wrapper.find('[data-testid="settings-icon-btn"]');
      expect(settingsIcon.exists())
        .toBe(true);
    });

    it('disables menu items when no pack is selected', async () => {
      const button = wrapper.find('[data-testid="settings-icon-btn"]');
      await button.trigger('click');

      await wrapper.vm.$nextTick();

      const menuItems = wrapper.findAllComponents({ name: 'MenuItem' });
      expect(menuItems.length)
        .toBe(3);
      menuItems.forEach(item => {
        expect(item.props('disabled'))
          .toBe(true);
      });
    });

    it('enables menu items when a pack is selected', async () => {
      const store = useClosetStore();
      const allPacks = [
        { id: 1, name: 'Pack 1', slug: 'pack-1' },
        { id: 2, name: 'Pack 2', slug: 'pack-2' },
        { id: 3, name: 'Pack 3', slug: 'pack-3' },
      ];

      store.$patch({ data: { allPacks, selectedPack: allPacks[0] }});
      await wrapper.vm.$nextTick();

      const button = wrapper.find('[data-testid="settings-icon-btn"]');
      await button.trigger('click');

      await wrapper.vm.$nextTick();

      const menuItems = wrapper.findAllComponents({ name: 'MenuItem' });
      expect(menuItems.length)
        .toBe(3);
      menuItems.forEach(item => {
        expect(item.props('disabled'))
          .toBe(false);
      });
    });
  });

  describe('Closet empty state', async () => {
    it('renders the empty state when not loading and no packs are available', async () => {
      const store = useClosetStore();
      store.pageLoading = false;
      store.data.allPacks = [];
      store.data.selectedPack = undefined;

      await wrapper.vm.$nextTick();

      const emptyState = wrapper.find('[data-testid="closet-empty-state"]');
      expect(emptyState.exists())
        .toBe(true);
    });
  });

  // describe('Pack Summary Widget', async () => {

  // });

  // describe('Category items list', async () => {

  // });
});