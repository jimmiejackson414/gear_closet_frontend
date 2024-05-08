import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import { type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VueTippy from 'vue-tippy';
import { createTestingPinia } from '@pinia/testing';
import Closet from '@/pages/closet.vue';
import { useClosetStore } from '@/stores/closet';
import { selectedPack } from './mocks/closet.mock';

// vi.mock('echarts/components', async (importOriginal) => {
//   const actual: any = await importOriginal();
//   return {
//     ...actual,
//     GridComponent: () => {},
//     LegendComponent: () => {},
//     TitleComponent: () => {},
//     TooltipComponent: () => {},
//   };
// });

// vi.mock('echarts/core', async (importOriginal) => {
//   const actual: any = await importOriginal();
//   return {
//     ...actual,
//     use: () => [],
//   };
// });

// vi.mock('vue-echarts', async () => ({
//   VChart: {
//     render: () => {},
//     mounted: () => {},
//   },
// }));

mockComponent('VChart', async () => {
  return true;
});

const allPacks = [
  { id: 1, name: 'Summer Pack', slug: 'd8a2423f-6c5b-4aa3-9e61-690f094d4c1e' },
  { id: 2, name: 'Pack 2', slug: 'pack-2' },
  { id: 3, name: 'Pack 3', slug: 'pack-3' },
];

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

  describe('Pack Summary empty state', async () => {
    it('renders the empty state when no categories have been created on a selectedPack', async () => {
      const store = useClosetStore();
      store.pageLoading = false;
      store.data.allPacks = allPacks;
      store.data.selectedPack = { ...selectedPack, categories: [] };

      await wrapper.vm.$nextTick();

      const emptyState = wrapper.find('[data-testid="pack-summary-empty-state"]');
      expect(emptyState.exists())
        .toBe(true);
      expect(emptyState.text())
        .toMatch(/Successfully created your new .+ pack!/);
      expect(emptyState.text())
        .toContain('The next step is to add some items to your pack.');
      expect(emptyState.text())
        .toContain('You can add items to your pack by clicking the Get Started button below or by uploading a CSV file.');
    });
  });

  describe('Pack Summary Widget', async () => {
    beforeEach(async () => {
      const store = useClosetStore();
      store.pageLoading = false;
      store.data.allPacks = allPacks;
      store.data.selectedPack = selectedPack;
      await wrapper.vm.$nextTick();
    });

    it('renders the pack summary widget correctly', async () => {
      await wrapper.vm.$nextTick();
      const packSummary = wrapper.find('[data-testid="pack-summary-widget"]');

      expect(packSummary.exists())
        .toBe(true);
    });

    // Unable to test this due to ESM restrictions in echarts library
    // it('renders the chart correctly', async () => {
    //   await wrapper.vm.$nextTick();
    //   const packSummary = wrapper.find('[data-testid="pack-summary-widget"]');
    //   const chart = wrapper.findComponent({ name: 'VCharts' });

    //   expect(packSummary.text())
    //     .toContain('Pack Summary');
    //   expect(chart.exists())
    //     .toBe(true);
    // });

    it('renders the stats correctly', async () => {
      await wrapper.vm.$nextTick();

      const packSummary = wrapper.find('[data-testid="pack-summary-widget"]');
      console.log({ packSummary });
      // const detailElements = packSummary.findAll('[data-testid="pack-summary-detail"]');
      // console.log({ detailElements });

      // expect(detailElements.length)
      //   .toBe(4);

      // const expectedDetails = [
      //   {title:"Worn",weight:4.18,color:"#0f6fc6"},
      //   {title:"Consumable",weight:0.19,color:"#009dd9"},
      //   {title:"Base",weight:15.32,color:"#0bd0d9"},
      //   {title:"Total",weight:19.69,color:"#10cf9b"},
      // ];

      // detailElements.forEach((element, index) => {
      //   const titleElement = element.find('span');
      //   const weightElement = element.find('h6');

      //   expect(titleElement.text())
      //     .toBe(expectedDetails[index].title);
      //   expect(parseFloat(weightElement.text()))
      //     .toBeCloseTo(expectedDetails[index].weight);
      // });
    });
  });

  // describe('Category items list', async () => {

  // });
});