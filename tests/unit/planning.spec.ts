import { mountSuspended } from '@nuxt/test-utils/runtime';
import { type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import VueTippy from 'vue-tippy';
import { createPinia, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import PlanningSettings from '@/components/planning/PlanningSettings.vue';
import PlanningEmptyState from '@/components/planning/PlanningEmptyState.vue';
import { trips } from './mocks/planning.mock';

describe('Planning Page', async () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('PlanningSettings.vue', async () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountSuspended(PlanningSettings, {
        global: {
          plugins: [VueTippy, createTestingPinia()],
        },
      });
    });

    it('renders the trip options in the list correctly', async () => {
      const store = usePlanningStore();

      store.$patch({ data: { trips }});
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
          subscriptions: [{ prices: { identifier: 'FREE' }}],
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
          subscriptions: [{ prices: { identifier: 'ANNUAL' }}],
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
          plugins: [VueTippy, createTestingPinia()],
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

  // });

  // describe('HikeDetailsWidget.vue', async () => {

  // });

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
});