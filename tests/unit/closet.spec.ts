import { mountSuspended } from '@nuxt/test-utils/runtime';
import { type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import VueTippy from 'vue-tippy';
import { createTestingPinia } from '@pinia/testing';
import round from 'lodash.round';
import convert, { type Mass } from 'convert';
import { useClosetStore } from '@/stores/closet';
import { selectedPack } from './mocks/closet.mock';
import ClosetSettings from '@/components/closet/ClosetSettings.vue';
import ClosetEmptyState from '@/components/closet/ClosetEmptyState.vue';
import { createPinia, setActivePinia } from 'pinia';
import PackSummaryEmptyState from '@/components/closet/dialogs/PackSummaryEmptyState.vue';
import ClosetPackDetails from '@/components/closet/ClosetPackDetails.vue';
import ClosetPackCategories from '@/components/closet/ClosetPackCategories.vue';
import PackItemsTable from '@/components/closet/PackItemsTable.vue';
import type { Tables } from '@/types';

const allPacks = [
  { id: 1, name: 'Summer Pack', slug: 'd8a2423f-6c5b-4aa3-9e61-690f094d4c1e' },
  { id: 2, name: 'Pack 2', slug: 'pack-2' },
  { id: 3, name: 'Pack 3', slug: 'pack-3' },
];

describe('Closet Page', async () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('ClosetSettings.vue', async () => {
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

  describe('ClosetEmptyState.vue', async () => {
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

  describe('ClosetPackDetails.vue and PackSummaryEmptyState.vue', async () => {
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

    it('renders the pack summary details', async () => {
      const wrapper = await mountSuspended(ClosetPackDetails, {
        global: {
          plugins: [VueTippy, createTestingPinia()],
        },
      });

      const store = useClosetStore();
      store.pageLoading = false;
      store.data.allPacks = allPacks;
      store.data.selectedPack = selectedPack;

      await wrapper.vm.$nextTick();

      // Data update
      store.data.selectedPack.categories[0].category_items[0].item.weight = "4.0";

      await wrapper.vm.$nextTick();

      const weights = calculatePackWeights(store.data.selectedPack);
      const weightDetails = wrapper.findAll('[data-testid="pack-summary-detail"]');

      for (let i = 0; i < weightDetails.length; i++) {
        const detail = weightDetails[i];
        const title = detail.find('[data-testid="detail-title"]')
          .text()
          .toLowerCase();
        if (title) {
          const weightInMg = weights[title as keyof typeof weights];
          const expectedWeight = round(convert(weightInMg, 'mg')
            .to('lb'), 2);

          const weightText = detail.find('[data-testid="detail-weight"]')
            .text();
          const weight = parseFloat(weightText.replace(' lbs', ''));
          expect(weight)
            .toBeCloseTo(expectedWeight, 2);
        }
      }

      store.data.selectedPack = selectedPack;
      // End data update

      // Theme update
      store.data.selectedPack!.theme = 'BREEZE6';
      await wrapper.vm.$nextTick();

      const colorDetails = wrapper.findAll('[data-testid="pack-summary-detail"]');
      for (let i = 0; i < colorDetails.length; i++) {
        const detail = colorDetails[i];
        const colorWrapper = detail.find('[data-testid="detail-weight"]');
        if (colorWrapper.element) {
          const color = (colorWrapper.element as HTMLElement).style.color;
          const expectedColor = findTheme('BREEZE6')[i];
          expect(color)
            .toBe(expectedColor);
        }
      }
      // End theme update

      // Dialog state
      expect(store.dialogStates.updateThemeModal)
        .toBe(false);

      const menuButton = wrapper.findComponent({ name: 'MenuButton' });
      menuButton.trigger('click');

      await wrapper.vm.$nextTick();

      const menuItem = wrapper.findAllComponents({ name: 'MenuItem' })[0];
      menuItem.trigger('click');
      expect(store.dialogStates.updateThemeModal)
        .toBe(true);
      // End dialog state

      // Rendering
      const renderedDetails = wrapper.findAll('[data-testid="pack-summary-detail"]');
      expect(renderedDetails.length)
        .toBe(4);
      // End rendering
    });

    // it('renders the chart correctly', async () => {
    //    Unable to test this due to ESM restrictions in echarts library
    // });
  });

  describe('ClosetPackCategories.vue', async () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('renders the category items list correctly', async () => {
      const wrapper = await mountSuspended(ClosetPackCategories, {
        global: {
          plugins: [VueTippy, createTestingPinia()],
        },
      });

      const store = useClosetStore();
      store.pageLoading = false;
      store.data.allPacks = allPacks;
      store.data.selectedPack = selectedPack;

      await wrapper.vm.$nextTick();

      expect(wrapper.exists())
        .toBe(true);
    });

    it('creates a new category when the add category button is clicked', async () => {
      const wrapper = await mountSuspended(ClosetPackCategories, {
        global: {
          plugins: [VueTippy, createTestingPinia()],
        },
      });

      const store = useClosetStore();
      store.pageLoading = false;
      store.data.allPacks = allPacks;
      store.data.selectedPack = structuredClone(selectedPack); // Deep copy

      const spy = vi.spyOn(wrapper.vm, 'createDefaultCategory' as any) as MockInstance;
      expect(spy.getMockName())
        .toEqual('createDefaultCategory');

      spy.mockImplementation(() => {
        store.data.selectedPack!.categories.unshift({
          name: '',
          pack_id: 0,
          slug: '',
          unit: 'g',
          id: 0,
          created_at: new Date()
            .toISOString(),
          updated_at: new Date()
            .toISOString(),
          category_items: [],
        });
      });

      expect(store.data.selectedPack!.categories.length)
        .toBe(8);

      const createCategoryButton = wrapper.findComponent({ name: 'GcButton' });
      createCategoryButton.trigger('click');

      expect(store.data.selectedPack!.categories.length)
        .toBe(9);
    });
  });

  describe('PackItemsTable.vue', async () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountSuspended(PackItemsTable, {
        global: {
          plugins: [VueTippy, createTestingPinia({
            initialState: {
              data: {
                selectedPack: structuredClone(selectedPack), // Deep copy
                allPacks,
              },
              pageLoading: false,
            },
          })],
        },
        props: {
          category: selectedPack.categories[0],
        },
      });
    });

    it('renders the items table correctly', async () => {
      expect(wrapper.exists())
        .toBe(true);
    });

    it('renders the New Item button if rows.length is greater than 0', async () => {
      await wrapper.vm.$nextTick();
      const newItemButton = wrapper.find('[data-testid="new-item-btn"]');
      expect(newItemButton.exists())
        .toBe(true);
    });

    it('creates a new item when the New Item button is clicked', async () => {
      const store = useClosetStore();
      store.data.allPacks = allPacks;
      store.data.selectedPack = structuredClone(selectedPack); // Deep copy
      const spy = vi.spyOn(wrapper.vm, 'createItem' as any) as MockInstance;

      expect(spy.getMockName())
        .toEqual('createItem');

      spy.mockImplementation(() => {
        store.data.selectedPack!.categories[0].category_items.push({
          id: 0,
          category_id: 1,
          item_id: 0,
          position: 8,
          created_at: new Date()
            .toISOString(),
          updated_at: new Date()
            .toISOString(),
          item: {
            ...generateItem(),
            id: 0,
          } as Tables<'items'>,
        });
      });

      expect(store.data.selectedPack!.categories[0].category_items.length)
        .toBe(7);

      const newItemButton = wrapper.find('[data-testid="new-item-btn"]');
      await newItemButton.trigger('click');

      expect(store.data.selectedPack!.categories[0].category_items.length)
        .toBe(8);
    });

    it('renders the category name correctly', async () => {
      const categoryName = wrapper.find('[data-testid="category-name"]');
      expect(categoryName.text())
        .toBe(selectedPack.categories[0].name);
    });

    it('emits handleRemoveCategory when clicking the remove category button', async () => {
      const removeCategoryButton = wrapper.find('[data-testid="remove-category-btn"]');
      await removeCategoryButton.trigger('click');
      expect(wrapper.emitted('handleRemoveCategory'))
        .toBeTruthy();
    });

    it('renders the correct number of rows in the table', async () => {
      const rows = wrapper.findAllComponents({ name: 'SlickItem' });
      expect(rows.length)
        .toBe(selectedPack.categories[0].category_items.length);
    });

    it('renders generic_type field correctly', async () => {
      const genericType = wrapper.find('[data-testid="generic-type-cell"]');
      expect(genericType.text())
        .toBe(selectedPack.categories[0].category_items[0].item.generic_type);
    });

    it('emits $store.updateItem when consumable button is clicked', async () => {
      const store = useClosetStore();
      const consumableButton = wrapper.find('[data-testid="consumable-btn"]');
      await consumableButton.trigger('click');
      expect(store.updateItem)
        .toHaveBeenCalledOnce();
    });

    it('emits $store.updateItem when worn button is clicked', async () => {
      const store = useClosetStore();
      const wornButton = wrapper.find('[data-testid="worn-btn"]');
      await wornButton.trigger('click');
      expect(store.updateItem)
        .toHaveBeenCalledOnce();
    });

    it('renders weight field correctly', async () => {
      const weight = wrapper.find('[data-testid="weight-cell"]');
      expect(weight.text())
        .toBe(selectedPack.categories[0].category_items[0].item.weight);
    });

    it('renders price field correctly', async () => {
      const price = wrapper.find('[data-testid="price-cell"]');
      const convertedPrice = convertCurrency(selectedPack.categories[0].category_items[0].item.price as number, 'USD');
      expect(price.text())
        .toBe(convertedPrice);
    });

    it('renders quantity field correctly', async () => {
      const quantity = wrapper.find('[data-testid="quantity-cell"]');
      expect(quantity.text())
        .toBe(String(selectedPack.categories[0].category_items[0].item.quantity));
    });

    it('emits handleAddUrl on click of link icon', async () => {
      const linkBtn = wrapper.find('[data-testid="add-url-btn"]');
      await linkBtn.trigger('click');
      expect(wrapper.emitted())
        .toHaveProperty('handleAddUrl');
    });

    it('emits handleRemoveItem on click of remove icon', async () => {
      const removeBtn = wrapper.find('[data-testid="remove-item-btn"]');
      await removeBtn.trigger('click');
      expect(wrapper.emitted())
        .toHaveProperty('handleRemoveItem');
    });

    it('displays the correct totals for weight, price, and quantity', async () => {
      const priceTotalCopy = wrapper.find('[data-testid="price-total"]');
      const priceTotal = (calculateCategoryPrice(selectedPack.categories[0]) / 100);
      const localizedTotal = priceTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      expect(priceTotalCopy.text())
        .toBe(localizedTotal);

      const quantityTotalCopy = wrapper.find('[data-testid="quantity-total"]');
      expect(quantityTotalCopy.text())
        .toBe(calculateCategoryQuantity(selectedPack.categories[0])
          .toString());

      const weightTotalCopy = wrapper.find('[data-testid="weight-total"]');
      const total = calculateCategoryWeight(selectedPack.categories[0]);
      const weight = convert(total, 'mg')
        .to(selectedPack.categories[0].unit as Mass)
        .toFixed(2);
      const localizedWeight = parseFloat(weight)
        .toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      expect(weightTotalCopy.text())
        .toBe(localizedWeight);
    });
  });

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