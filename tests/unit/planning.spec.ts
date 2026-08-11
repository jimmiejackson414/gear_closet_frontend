import { mountSuspended } from '@nuxt/test-utils/runtime';
import { type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { isButtonDisabled, isDialogRootOpen, testMountGlobals } from './helpers';
import { tripDetails, trips } from './mocks/planning.mock';
import ModifyDetailDialog from '@/components/planning/dialogs/ModifyDetailDialog.vue';
import PlanningEmptyState from '@/components/planning/PlanningEmptyState.vue';
import PlanningSettings from '@/components/planning/PlanningSettings.vue';
import HikeDetailsWidget from '@/components/planning/widgets/HikeDetailsWidget.vue';
import { usePlanningStore } from '@/stores/planning';

describe('Planning Page', async () => {
  describe('PlanningSettings.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(PlanningSettings, {
        global: testMountGlobals({
          planning: {
            pageLoading: false,
            data: { trips: [] },
          },
        }),
      });
    });

    it('renders the trip options in the list correctly', async () => {
      const store = usePlanningStore();
      store.$patch({ data: { trips } });
      await wrapper.vm.$nextTick();

      const select = wrapper.findComponent({ name: 'SelectRoot' });
      const selectItems = wrapper.findAllComponents({ name: 'SelectItem' });
      const optionValues = [...new Set(selectItems.map(item => item.props('value')))];
      const optionLabels = [...new Set(selectItems.map(item => item.text()))];

      expect(select.exists())
        .toBe(true);
      expect(optionLabels)
        .toEqual(trips.map(trip => trip.name));
      expect(optionValues)
        .toEqual(trips.map(trip => String(trip.id)));
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
        } as any,
      });
      await wrapper.vm.$nextTick();

      const newTripButton = wrapper.findAllComponents({ name: 'Button' })
        .find(b => b.text()
          .includes('New Trip'))!;
      expect(isButtonDisabled(newTripButton))
        .toBe(true);
    });

    it('enables New Trip button when isPaidMember is true', async () => {
      const store = usePlanningStore();
      const userStore = useUserStore();

      store.$patch({ data: { trips }, pageLoading: false });
      userStore.$patch({
        profile: {
          subscriptions: [{ prices: { identifier: 'ANNUAL' } }],
        } as any,
      });
      await wrapper.vm.$nextTick();

      const newTripButton = wrapper.findAllComponents({ name: 'Button' })
        .find(b => b.text()
          .includes('New Trip'))!;
      expect(isButtonDisabled(newTripButton))
        .toBe(false);
    });
  });

  describe('PlanningEmptyState.vue', async () => {
    it('renders the empty state when not loading and no trips are present', async () => {
      const wrapper = await mountSuspended(PlanningEmptyState, {
        global: testMountGlobals({
          planning: {
            pageLoading: false,
            data: { trips: [] },
          },
        }),
      });

      expect(wrapper.exists())
        .toBe(true);
      expect(wrapper.find('h5')
        .text())
        .toMatch(/You haven't created any trips yet!/);
      expect(wrapper.find('p')
        .text())
        .toMatch(/Click the button below to get started./);
      expect(wrapper.findComponent({ name: 'Button' })
        .exists())
        .toBe(true);
    });
  });

  describe('HikeDetailsWidget.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(HikeDetailsWidget, {
        global: testMountGlobals({
          planning: {
            pageLoading: false,
            data: { trip_details: [] },
          },
        }),
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

  describe('ModifyDetailDialog.vue', async () => {
    it('renders the dialog when open with an active detail', async () => {
      const wrapper = await mountSuspended(ModifyDetailDialog, {
        global: testMountGlobals({
          planning: {
            pageLoading: false,
            data: { trip_details: tripDetails },
          },
        }),
        attachTo: document.body,
        props: {
          activeDetail: tripDetails[0],
          isOpen: true,
        },
      });

      expect(isDialogRootOpen(wrapper))
        .toBe(true);
      expect(document.body.textContent)
        .toContain('Edit Hike Detail');
    });
  });
});
