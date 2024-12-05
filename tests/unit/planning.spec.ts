import { mountSuspended } from '@nuxt/test-utils/runtime';
import { type VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { type MockInstance, beforeEach, describe, expect, it, vi } from 'vitest';
import VueTippy from 'vue-tippy';
import { tripDetails, trips } from './mocks/planning.mock';
import ModifyDetailDialog from '@/components/planning/dialogs/ModifyDetailDialog.vue';
import PlanningEmptyState from '@/components/planning/PlanningEmptyState.vue';
import PlanningSettings from '@/components/planning/PlanningSettings.vue';
import HikeDetailsWidget from '@/components/planning/widgets/HikeDetailsWidget.vue';

describe('Planning Page', async () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('PlanningSettings.vue', async () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountSuspended(PlanningSettings, {
        global: {
          plugins: [VueTippy],
        },
      });
    });

    it('renders the trip options in the list correctly', async () => {
      const store = usePlanningStore();

      store.$patch({ data: { trips } });
      await wrapper.vm.$nextTick();

      const select = wrapper.findComponent({ name: 'GcSelect' });
      expect(select.exists())
        .toBe(true);
      expect(select.props('options'))
        .toEqual(trips.map(trip => ({ label: trip.name, value: trip.id })));
    });

    it('renders the options icon correctly', async () => {
      const settingsIcon = wrapper.find('[data-testid="settings-icon"]');
      expect(settingsIcon.exists())
        .toBe(true);
    });

    it('disables New Trip button when isPaidMember is false and data.trips length is greater than or equal to 1', async () => {
      const store = usePlanningStore();
      const userStore = useUserStore();

      store.$patch({ data: { trips }, pageLoading: false });
      userStore.$patch({
        profile: {
          subscriptions: [{ prices: { identifier: 'FREE' } }],
        },
      });
      await wrapper.vm.$nextTick();

      const newTripButton = wrapper.findComponent({ name: 'GcButton' });
      expect(newTripButton.props('disabled'))
        .toBe(true);
    });

    it('enables New Trip button when isPaidMember is true', async () => {
      const store = usePlanningStore();
      const userStore = useUserStore();

      store.$patch({ data: { trips }, pageLoading: false });
      userStore.$patch({
        profile: {
          subscriptions: [{ prices: { identifier: 'ANNUAL' } }],
        },
      });
      await wrapper.vm.$nextTick();

      const newTripButton = wrapper.findComponent({ name: 'GcButton' });
      expect(newTripButton.props('disabled'))
        .toBe(false);
    });
  });

  describe('PlanningEmptyState.vue', async () => {
    it('renders the empty state when not loading and no trips are present', async () => {
      const wrapper = await mountSuspended(PlanningEmptyState, {
        global: {
          plugins: [VueTippy],
        },
      });
      const store = usePlanningStore();
      store.pageLoading = false;
      store.data.trips = [];

      await wrapper.vm.$nextTick();

      expect(wrapper.exists())
        .toBe(true);
      expect(wrapper.find('h5')
        .text())
        .toMatch(/You haven't created any trips yet!/);
      expect(wrapper.find('p')
        .text())
        .toMatch(/Click the button below to get started./);
      expect(wrapper.findComponent({ name: 'gc-button' })
        .exists())
        .toBe(true);
    });
  });

  // describe('PackWidget.vue', async () => {
  // unable to test due to ESM restrictions of echarts
  // });

  describe('HikeDetailsWidget.vue', async () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountSuspended(HikeDetailsWidget, {
        global: {
          plugins: [VueTippy],
        },
      });
    });

    it('renders the hike details widget', async () => {
      expect(wrapper.exists())
        .toBe(true);
    });

    it('renders the loading skeleton if pageLoading is true', async () => {
      const store = usePlanningStore();
      store.pageLoading = true;
      await wrapper.vm.$nextTick();

      const skeleton = wrapper.findComponent({ name: 'GcSkeleton' });
      expect(skeleton.exists())
        .toBe(true);
    });

    it('renders the empty state if no hike details are present', async () => {
      const store = usePlanningStore();
      store.$patch({ data: { trip_details: [] }, pageLoading: false });
      await wrapper.vm.$nextTick();

      const emptyState = wrapper.find('[data-testid="hike-details-empty-state"]');
      expect(emptyState.exists())
        .toBe(true);
    });

    it('renders the Create New Detail icon button if hike details are present', async () => {
      const store = usePlanningStore();
      store.$patch({ data: { trip_details: tripDetails }, pageLoading: false });
      await wrapper.vm.$nextTick();

      const createDetailButton = wrapper.find('[data-testid="create-new-detail-btn"]');
      expect(createDetailButton.exists())
        .toBe(true);
    });
  });

  // describe('TripDetailsWidget.vue', async () => {

  // });

  // describe('TripFriendsWidget.vue', async () => {

  // });

  // describe('TodosWidget.vue', async () => {

  // });

  // describe('ShoppingListWidget.vue', async () => {

  // });

  // describe('PollWidget.vue', async () => {

  // });

  describe('ModifyDetailDialog.vue', async () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountSuspended(ModifyDetailDialog, {
        global: {
          plugins: [VueTippy],
        },
      });
    });

    it('can update a detail', async () => {
      const store = usePlanningStore();
      store.$patch({
        // activeDetail: tripDetails[0],
        data: {
          trip_details: tripDetails,
        },
        // dialogStates: {
        //   modifyDetailDialog: true,
        // },
        pageLoading: false,
      });
      await wrapper.vm.$nextTick();

      const checkbox = wrapper.find('input[type="checkbox"]');
      await checkbox.trigger('change');
      await wrapper.vm.$nextTick();

      const spy = vi.spyOn(wrapper.vm, 'updateDetail' as any) as MockInstance;
      expect(spy.getMockName())
        .toEqual('updateDetail');

      const beforeDetail = {};

      const inputs = wrapper.findAllComponents({ name: 'GcInput' });
      await inputs[0].setValue('New Detail');
      await inputs[1].setValue('Description');
      await inputs[2].setValue('https://www.google.com');

      const createDetailButton = wrapper.find('[data-testid="submit-new-detail-btn"]');
      await createDetailButton.trigger('click');

      expect(spy)
        .toHaveBeenCalled();
      expect(wrapper.vm.activeDetail).not.toEqual(beforeDetail);
    });
  });
});