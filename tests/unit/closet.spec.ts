import { mountSuspended } from '@nuxt/test-utils/runtime';
import { type VueWrapper } from '@vue/test-utils';
import convert from 'convert';
import round from 'lodash.round';
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  findBodyButton,
  getMenuItemsFromBody,
  isAlertDialogOpen,
  isButtonDisabled,
  isDialogRootOpen,
  openDropdownMenu,
  testMountGlobals,
} from './helpers';
import { selectedPack } from './mocks/closet.mock';
import ClosetEmptyState from '@/components/closet/ClosetEmptyState.vue';
import ClosetPackCategories from '@/components/closet/ClosetPackCategories.vue';
import ClosetPackDetails from '@/components/closet/ClosetPackDetails.vue';
import ClosetSettings from '@/components/closet/ClosetSettings.vue';
import AddUrlDialog from '@/components/closet/dialogs/AddUrlDialog.vue';
import CsvUploadDialog from '@/components/closet/dialogs/CsvUploadDialog.vue';
import DeleteCategoryDialog from '@/components/closet/dialogs/DeleteCategoryDialog.vue';
import DeletePackDialog from '@/components/closet/dialogs/DeletePackDialog.vue';
import ManagePackSettingsDialog from '@/components/closet/dialogs/ManagePackSettingsDialog.vue';
import PackSummaryEmptyState from '@/components/closet/dialogs/PackSummaryEmptyState.vue';
import RemoveItemDialog from '@/components/closet/dialogs/RemoveItemDialog.vue';
import SharePackDialog from '@/components/closet/dialogs/SharePackDialog.vue';
import PackItemsTable from '@/components/closet/PackItemsTable.vue';
import { useClosetStore } from '@/stores/closet';
import type { Tables } from '@/types';

const allPacks = [
  { id: 1, name: 'Summer Pack', slug: 'd8a2423f-6c5b-4aa3-9e61-690f094d4c1e' },
  { id: 2, name: 'Pack 2', slug: 'pack-2' },
  { id: 3, name: 'Pack 3', slug: 'pack-3' },
];

const closetWithPacks = {
  closet: {
    pageLoading: false,
    data: {
      allPacks,
      selectedPack: structuredClone(selectedPack),
    },
  },
};

describe('Closet Page', async () => {
  describe('ClosetSettings.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(ClosetSettings, {
        global: testMountGlobals({
          closet: {
            pageLoading: false,
            data: { allPacks: [], selectedPack: undefined },
          },
        }),
        attachTo: document.body,
      });
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = '';
    });

    it('renders the available packs in the list correctly', async () => {
      const store = useClosetStore();
      store.$patch({ data: { allPacks } });
      await wrapper.vm.$nextTick();

      const select = wrapper.findComponent({ name: 'SelectRoot' });
      const selectItems = wrapper.findAllComponents({ name: 'SelectItem' });
      const optionValues = [...new Set(selectItems.map(item => item.props('value')))];
      const optionLabels = [...new Set(selectItems.map(item => item.text()))];

      expect(select.exists())
        .toBe(true);
      expect(optionLabels)
        .toEqual(allPacks.map(p => p.name));
      expect(optionValues)
        .toEqual(allPacks.map(p => String(p.id)));
    });

    it('renders the options icon correctly', async () => {
      const settingsIcon = wrapper.find('[data-testid="settings-icon"]');
      expect(settingsIcon.exists())
        .toBe(true);
    });

    it('exposes an accessible name on the pack actions trigger', async () => {
      const trigger = document.querySelector('[aria-label="Pack actions"]');
      expect(trigger)
        .toBeTruthy();
    });

    it('disables menu items when no pack is selected', async () => {
      await openDropdownMenu(wrapper);
      const menuItems = getMenuItemsFromBody();
      expect(menuItems.length)
        .toBe(4);
      menuItems.forEach(item => {
        expect(item.getAttribute('data-disabled') === '' || item.getAttribute('aria-disabled') === 'true')
          .toBe(true);
      });
    });

    it('enables menu items when a pack is selected', async () => {
      const store = useClosetStore();
      store.$patch({ data: { allPacks, selectedPack: allPacks[0] as any } });
      await wrapper.vm.$nextTick();

      await openDropdownMenu(wrapper);
      const menuItems = getMenuItemsFromBody();
      expect(menuItems.length)
        .toBe(4);
      menuItems.forEach(item => {
        expect(item.getAttribute('data-disabled'))
          .toBeNull();
        expect(item.getAttribute('aria-disabled'))
          .not.toBe('true');
      });
    });

    it('disables New Pack button and displays tooltip when isPaidMember is false and allPacks length is greater than or equal to 1', async () => {
      const store = useClosetStore();
      const userStore = useUserStore();

      store.$patch({ data: { allPacks, selectedPack } });
      userStore.$patch({
        profile: {
          subscriptions: [{ prices: { identifier: 'FREE' } }],
        } as any,
      });
      await wrapper.vm.$nextTick();

      const newPackButton = wrapper.findAllComponents({ name: 'Button' })
        .find(b => b.text()
          .includes('New Pack'))!;
      expect(isButtonDisabled(newPackButton))
        .toBe(true);
    });

    it('enables New Pack button when isPaidMember is true', async () => {
      const store = useClosetStore();
      const userStore = useUserStore();

      store.$patch({ data: { allPacks, selectedPack } });
      userStore.$patch({
        profile: {
          subscriptions: [{ prices: { identifier: 'ANNUAL' } }],
        } as any,
      });
      await wrapper.vm.$nextTick();

      const newPackButton = wrapper.findAllComponents({ name: 'Button' })
        .find(b => b.text()
          .includes('New Pack'))!;
      expect(isButtonDisabled(newPackButton))
        .toBe(false);
    });
  });

  describe('ClosetEmptyState.vue', async () => {
    it('renders the empty state when not loading and no packs are available', async () => {
      const wrapper = await mountSuspended(ClosetEmptyState, {
        global: testMountGlobals({
          closet: {
            pageLoading: false,
            data: { allPacks: [], selectedPack: undefined },
          },
        }),
      });

      expect(wrapper.exists())
        .toBe(true);
      expect(wrapper.find('h5')
        .text())
        .toMatch(/You haven't created any packs yet!/);
      expect(wrapper.find('p')
        .text())
        .toMatch(/Click the button below to get started./);
      expect(wrapper.findComponent({ name: 'Button' })
        .exists())
        .toBe(true);
    });
  });

  describe('ClosetPackDetails.vue and PackSummaryEmptyState.vue', async () => {
    it('renders the empty state when no categories have been created on a selectedPack', async () => {
      const wrapper = await mountSuspended(PackSummaryEmptyState, {
        global: testMountGlobals({
          closet: {
            pageLoading: false,
            data: {
              allPacks,
              selectedPack: { ...selectedPack, categories: [] },
            },
          },
        }),
      });

      const emptyState = wrapper.find('[data-testid="pack-summary-empty-state"]');
      expect(emptyState.exists())
        .toBe(true);
      expect(emptyState.text())
        .toContain('Summer Pack is ready.');
      expect(emptyState.text())
        .toContain('The next step is to add some items to your pack.');
      expect(emptyState.text())
        .toContain('You can add items to your pack by clicking the Get Started button below or by uploading a CSV file.');
    });

    it('renders the pack summary details', async () => {
      const pack = structuredClone(selectedPack);
      const wrapper = await mountSuspended(ClosetPackDetails, {
        global: testMountGlobals({
          closet: {
            pageLoading: false,
            data: { allPacks, selectedPack: pack },
          },
        }),
      });

      const store = useClosetStore();
      const firstCategory = store.data.selectedPack!.categories[0];
      const firstCategoryItem = firstCategory?.category_items[0];
      expect(firstCategoryItem)
        .toBeDefined();
      firstCategoryItem!.item.weight = '4.0';
      await wrapper.vm.$nextTick();

      const weights = calculatePackWeights(store.data.selectedPack!);
      const weightDetails = wrapper.findAll('[data-testid="pack-summary-detail"]');

      for (let i = 0; i < weightDetails.length; i++) {
        const detail = weightDetails[i];
        if (!detail) continue;
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

      store.data.selectedPack!.theme = 'BREEZE6';
      await wrapper.vm.$nextTick();

      const colorDetails = wrapper.findAll('[data-testid="pack-summary-detail"]');
      for (let i = 0; i < colorDetails.length; i++) {
        const detail = colorDetails[i];
        if (!detail) continue;
        const colorWrapper = detail.find('[data-testid="detail-weight"]');
        if (colorWrapper.element) {
          const color = (colorWrapper.element as HTMLElement).style.color;
          const expectedColor = findTheme('BREEZE6')[i];
          expect(color)
            .toBe(expectedColor);
        }
      }

      const renderedDetails = wrapper.findAll('[data-testid="pack-summary-detail"]');
      expect(renderedDetails.length)
        .toBe(4);
    });
  });

  describe('ClosetPackCategories.vue', async () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('renders the category items list correctly', async () => {
      const wrapper = await mountSuspended(ClosetPackCategories, {
        global: testMountGlobals(closetWithPacks),
      });

      expect(wrapper.exists())
        .toBe(true);
    });

    it('creates a new category when the add category button is clicked', async () => {
      const wrapper = await mountSuspended(ClosetPackCategories, {
        global: testMountGlobals({
          closet: {
            pageLoading: false,
            data: {
              allPacks,
              selectedPack: structuredClone(selectedPack),
            },
          },
        }),
      });

      const store = useClosetStore();
      const spy = vi.spyOn(wrapper.vm, 'createDefaultCategory' as any) as MockInstance;
      expect(spy.getMockName())
        .toEqual('createDefaultCategory');

      spy.mockImplementation(() => {
        store.data.selectedPack!.categories.unshift({
          name: '',
          pack_id: 0,
          slug: '',
          unit: 'g',
          position: 1,
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

      const createCategoryButton = wrapper.findAllComponents({ name: 'Button' })
        .find(b => b.text()
          .includes('New Category'))!;
      await createCategoryButton.trigger('click');

      expect(store.data.selectedPack!.categories.length)
        .toBe(9);
    });
  });

  describe('PackItemsTable.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(PackItemsTable, {
        global: testMountGlobals({
          closet: {
            pageLoading: false,
            data: {
              allPacks,
              selectedPack: structuredClone(selectedPack),
            },
          },
        }),
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
      const spy = vi.spyOn(wrapper.vm, 'createDefaultItem' as any) as MockInstance;

      expect(spy.getMockName())
        .toEqual('createDefaultItem');

      spy.mockImplementation(() => {
        store.data.selectedPack!.categories[0]!.category_items.push({
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

      expect(store.data.selectedPack!.categories[0]!.category_items.length)
        .toBe(7);

      const newItemButton = wrapper.find('[data-testid="new-item-btn"]');
      await newItemButton.trigger('click');

      expect(store.data.selectedPack!.categories[0]!.category_items.length)
        .toBe(8);
    });

    it('renders the category name correctly', async () => {
      const categoryName = wrapper.find('[data-testid="category-name"]');
      expect(categoryName.text())
        .toBe(selectedPack.categories[0]!.name);
    });

    it('emits handleRemoveCategory when clicking the remove category button', async () => {
      const removeCategoryButton = wrapper.find('[data-testid="remove-category-btn"]');
      await removeCategoryButton.trigger('click');
      expect(wrapper.emitted('handleRemoveCategory'))
        .toBeTruthy();
    });

    it('exposes accessible names on icon-only item controls', async () => {
      expect(wrapper.find('[data-testid="remove-category-btn"]').attributes('aria-label'))
        .toBe('Remove category');
      expect(wrapper.find('[data-testid="consumable-btn"]').attributes('aria-label'))
        .toMatch(/Mark item as (not )?consumable/);
      expect(wrapper.find('[data-testid="worn-btn"]').attributes('aria-label'))
        .toMatch(/Mark item as (not )?worn/);
      expect(wrapper.find('[data-testid="add-url-btn"]').attributes('aria-label'))
        .toBe('Add or edit item URL');
      expect(wrapper.find('[data-testid="remove-item-btn"]').attributes('aria-label'))
        .toBe('Remove item');
    });

    it('renders the correct number of rows in the table', async () => {
      const rows = wrapper.findAll('[data-testid="generic-type-cell"]');
      const totalItems = selectedPack.categories.reduce((count, category) => count + category.category_items.length, 0);
      expect(rows.length)
        .toBe(totalItems);
    });

    it('renders generic_type field correctly', async () => {
      const genericType = wrapper.find('[data-testid="generic-type-cell"]');
      expect(genericType.text())
        .toBe(selectedPack.categories[0]!.category_items[0]!.item.generic_type);
    });

    it('emits $store.updateItem when consumable button is clicked', async () => {
      const store = useClosetStore();
      vi.spyOn(store, 'updateItem' as any) as MockInstance;
      await wrapper.vm.$nextTick();

      const consumableButton = wrapper.find('[data-testid="consumable-btn"]');
      await consumableButton.trigger('click');
      expect(store.updateItem)
        .toHaveBeenCalledOnce();
    });

    it('emits $store.updateItem when worn button is clicked', async () => {
      const store = useClosetStore();
      vi.spyOn(store, 'updateItem' as any) as MockInstance;
      await wrapper.vm.$nextTick();

      const wornButton = wrapper.find('[data-testid="worn-btn"]');
      await wornButton.trigger('click');
      expect(store.updateItem)
        .toHaveBeenCalledOnce();
    });

    it('renders weight field correctly', async () => {
      const weight = wrapper.find('[data-testid="weight-cell"]');
      expect(weight.text())
        .toContain(selectedPack.categories[0]!.category_items[0]!.item.weight as string);
    });

    it('renders price field correctly', async () => {
      const price = wrapper.find('[data-testid="price-cell"]');
      expect(price.text())
        .toContain(`$${selectedPack.categories[0]!.category_items[0]!.item.price}`);
    });

    it('renders quantity field correctly', async () => {
      const quantity = wrapper.find('[data-testid="quantity-cell"]');
      expect(quantity.text())
        .toContain(String(selectedPack.categories[0]!.category_items[0]!.item.quantity));
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
      const category = selectedPack.categories[0]!;
      const priceTotalCopy = wrapper.find('[data-testid="price-total"]');
      expect(priceTotalCopy.text())
        .toBe(`$${calculateCategoryPrice(category)}`);

      const quantityTotalCopy = wrapper.find('[data-testid="quantity-total"]');
      expect(quantityTotalCopy.text())
        .toBe(calculateCategoryQuantity(category)
          .toString());

      const weightTotalCopy = wrapper.find('[data-testid="weight-total"]');
      expect(weightTotalCopy.text())
        .toBe(String(calculateCategoryWeight(category)));
    });
  });

  describe('ManagePackSettingsDialog.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(ManagePackSettingsDialog, {
        global: testMountGlobals(),
        attachTo: document.body,
      });
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = '';
    });

    it('renders the dialog correctly', async () => {
      const store = useClosetStore();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
      store.dialogStates.managePackSettingsDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
    });

    it('closes the dialog correctly', async () => {
      const store = useClosetStore();
      store.dialogStates.managePackSettingsDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
      findBodyButton('Cancel')
        ?.click();
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
    });
  });

  describe('CsvUploadDialog.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(CsvUploadDialog, {
        global: testMountGlobals(),
        attachTo: document.body,
      });
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = '';
    });

    it('renders the dialog correctly', async () => {
      const store = useClosetStore();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
      store.dialogStates.uploadCsvDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
    });

    it('closes the dialog correctly', async () => {
      const store = useClosetStore();
      store.dialogStates.uploadCsvDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
      findBodyButton('Cancel')
        ?.click();
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
    });
  });

  describe('SharePackDialog.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(SharePackDialog, {
        global: testMountGlobals(),
        attachTo: document.body,
      });
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = '';
    });

    it('renders the dialog correctly', async () => {
      const store = useClosetStore();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
      store.dialogStates.sharePackDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
    });

    it('closes the dialog correctly', async () => {
      const store = useClosetStore();
      store.dialogStates.sharePackDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
      findBodyButton('Cancel')
        ?.click();
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
    });
  });

  describe('DeleteCategoryDialog.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(DeleteCategoryDialog, {
        global: testMountGlobals(),
        attachTo: document.body,
      });
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = '';
    });

    it('renders the dialog correctly', async () => {
      const store = useClosetStore();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
      store.dialogStates.deleteCategoryDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
    });

    it('closes the dialog correctly', async () => {
      const store = useClosetStore();
      store.dialogStates.deleteCategoryDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
      findBodyButton('Cancel')
        ?.click();
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
    });
  });

  describe('DeletePackDialog.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(DeletePackDialog, {
        global: testMountGlobals(),
        attachTo: document.body,
      });
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = '';
    });

    it('renders the dialog correctly', async () => {
      const store = useClosetStore();
      expect(isAlertDialogOpen(wrapper))
        .toBe(false);
      store.dialogStates.deletePackDialog = true;
      await wrapper.vm.$nextTick();
      expect(isAlertDialogOpen(wrapper))
        .toBe(true);
    });

    it('closes the dialog correctly', async () => {
      const store = useClosetStore();
      store.dialogStates.deletePackDialog = true;
      await wrapper.vm.$nextTick();
      expect(isAlertDialogOpen(wrapper))
        .toBe(true);
      findBodyButton('Cancel')
        ?.click();
      await wrapper.vm.$nextTick();
      expect(isAlertDialogOpen(wrapper))
        .toBe(false);
    });
  });

  describe('RemoveItemDialog.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(RemoveItemDialog, {
        global: testMountGlobals(),
        attachTo: document.body,
      });
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = '';
    });

    it('renders the dialog correctly', async () => {
      const store = useClosetStore();
      expect(isAlertDialogOpen(wrapper))
        .toBe(false);
      store.dialogStates.removeItemDialog = true;
      await wrapper.vm.$nextTick();
      expect(isAlertDialogOpen(wrapper))
        .toBe(true);
    });

    it('closes the dialog correctly', async () => {
      const store = useClosetStore();
      store.dialogStates.removeItemDialog = true;
      await wrapper.vm.$nextTick();
      expect(isAlertDialogOpen(wrapper))
        .toBe(true);
      findBodyButton('Cancel')
        ?.click();
      await wrapper.vm.$nextTick();
      expect(isAlertDialogOpen(wrapper))
        .toBe(false);
    });
  });

  describe('AddUrlDialog.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(AddUrlDialog, {
        global: testMountGlobals(),
        attachTo: document.body,
      });
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = '';
    });

    it('renders the dialog correctly', async () => {
      const store = useClosetStore();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
      store.dialogStates.addUrlDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
    });

    it('closes the dialog correctly', async () => {
      const store = useClosetStore();
      store.dialogStates.addUrlDialog = true;
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(true);
      findBodyButton('Cancel')
        ?.click();
      await wrapper.vm.$nextTick();
      expect(isDialogRootOpen(wrapper))
        .toBe(false);
    });
  });
});
