import { mountSuspended } from '@nuxt/test-utils/runtime';
import { type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import VueTippy from 'vue-tippy';
import { createTestingPinia } from '@pinia/testing';
import { useClosetStore } from '@/stores/closet';
import { selectedPack } from './mocks/closet.mock';
import ClosetSettings from '@/components/closet/ClosetSettings.vue';
import ClosetEmptyState from '@/components/closet/ClosetEmptyState.vue';
import { createPinia, setActivePinia } from 'pinia';
import PackSummaryEmptyState from '@/components/closet/dialogs/PackSummaryEmptyState.vue';

const allPacks = [
  { id: 1, name: 'Summer Pack', slug: 'd8a2423f-6c5b-4aa3-9e61-690f094d4c1e' },
  { id: 2, name: 'Pack 2', slug: 'pack-2' },
  { id: 3, name: 'Pack 3', slug: 'pack-3' },
];

describe('Closet Page', async () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Settings', async () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountSuspended(ClosetSettings, {
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

    it('disables New Pack button and displays tooltip when isPaidMember is false and allPacks length is greater than or equal to 1', async () => {
      const store = useClosetStore();
      const userStore = useUserStore();

      store.$patch({ data: { allPacks, selectedPack }});
      userStore.$patch({
        profile: {
          subscriptions: [{ prices: { identifier: 'FREE' } }],
        },
      });
      await wrapper.vm.$nextTick();

      const newPackButton = wrapper.findComponent({ name: 'gc-button' });
      expect(newPackButton.props('disabled'))
        .toBe(true);
    });

    it('enables New Pack button when isPaidMember is true', async () => {
      const store = useClosetStore();
      const userStore = useUserStore();

      store.$patch({ data: { allPacks, selectedPack }});
      userStore.$patch({
        profile: {
          subscriptions: [{ prices: { identifier: 'ANNUAL' } }],
        },
      });
      await wrapper.vm.$nextTick();

      const newPackButton = wrapper.findComponent({ name: 'gc-button' });
      expect(newPackButton.props('disabled'))
        .toBe(false);
    });
  });

  describe('Closet empty state', async () => {
    it('renders the empty state when not loading and no packs are available', async () => {
      const wrapper = await mountSuspended(ClosetEmptyState, {
        global: {
          plugins: [VueTippy, createTestingPinia()],
        },
      });
      const store = useClosetStore();
      store.pageLoading = false;
      store.data.allPacks = [];
      store.data.selectedPack = undefined;

      await wrapper.vm.$nextTick();

      expect(wrapper.exists())
        .toBe(true);
      expect(wrapper.find('h5')
        .text())
        .toMatch(/You haven't created any packs yet!/);
      expect(wrapper.find('p')
        .text())
        .toMatch(/Click the button below to get started./);
      expect(wrapper.findComponent({ name: 'gc-button' })
        .exists())
        .toBe(true);
    });
  });

  describe('Pack Summary empty state', async () => {
    it('renders the empty state when no categories have been created on a selectedPack', async () => {
      const wrapper = await mountSuspended(PackSummaryEmptyState, {
        global: {
          plugins: [VueTippy, createTestingPinia()],
        },
      });

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

  // describe('Pack Summary Widget', async () => {
  //   beforeEach(async () => {
  //     const store = useClosetStore();
  //     store.pageLoading = false;
  //     store.data.allPacks = allPacks;
  //     store.data.selectedPack = selectedPack;
  //     await wrapper.vm.$nextTick();
  //   });

  //   it('renders the pack summary widget correctly', async () => {
  //     await wrapper.vm.$nextTick();
  //     const packSummary = wrapper.find('[data-testid="pack-summary-widget"]');

  //     expect(packSummary.exists())
  //       .toBe(true);
  //   });

  //   // Unable to test this due to ESM restrictions in echarts library
  //   // it('renders the chart correctly', async () => {
  //   //   await wrapper.vm.$nextTick();
  //   //   const packSummary = wrapper.find('[data-testid="pack-summary-widget"]');
  //   //   const chart = wrapper.findComponent({ name: 'VCharts' });

  //   //   expect(packSummary.text())
  //   //     .toContain('Pack Summary');
  //   //   expect(chart.exists())
  //   //     .toBe(true);
  //   // });

  //   it('renders the stats correctly', async () => {
  //     await wrapper.vm.$nextTick();

  //     const packSummary = wrapper.find('[data-testid="pack-summary-widget"]');
  //     console.log({ packSummary });
  //     // const detailElements = packSummary.findAll('[data-testid="pack-summary-detail"]');
  //     // console.log({ detailElements });

  //     // expect(detailElements.length)
  //     //   .toBe(4);

  //     // const expectedDetails = [
  //     //   {title:"Worn",weight:4.18,color:"#0f6fc6"},
  //     //   {title:"Consumable",weight:0.19,color:"#009dd9"},
  //     //   {title:"Base",weight:15.32,color:"#0bd0d9"},
  //     //   {title:"Total",weight:19.69,color:"#10cf9b"},
  //     // ];

  //     // detailElements.forEach((element, index) => {
  //     //   const titleElement = element.find('span');
  //     //   const weightElement = element.find('h6');

  //     //   expect(titleElement.text())
  //     //     .toBe(expectedDetails[index].title);
  //     //   expect(parseFloat(weightElement.text()))
  //     //     .toBeCloseTo(expectedDetails[index].weight);
  //     // });
  //   });
  // });

  // describe('Category items list', async () => {

  // });

  // describe('Create Pack Dialog', async () => {

  // });

  // describe('Import From CSV Dialog', async () => {

  // });

  // describe('Share Pack List Dialog', async () => {

  // });

  // describe('Delete Category Dialog', async () => {

  // });

  // describe('Delete Pack Dialog', async () => {

  // });

  // describe('Remove Item Dialog', async () => {

  // });

  // describe('Add URL Dialog', async () => {

  // });

  // describe('Update Theme Dialog', async () => {

  // });
});