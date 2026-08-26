import { mountSuspended } from '@nuxt/test-utils/runtime';
import { type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ModifyDetailDialog from '@/components/planning/dialogs/ModifyDetailDialog.vue';
import PlanningEmptyState from '@/components/planning/PlanningEmptyState.vue';
import PlanningSettings from '@/components/planning/PlanningSettings.vue';
import HikeDetailsWidget from '@/components/planning/widgets/HikeDetailsWidget.vue';
import TripDetailsWidget from '@/components/planning/widgets/TripDetailsWidget.vue';
import { usePlanningStore } from '@/stores/planning';
import { TripDetailsType } from '@/types';
import { isButtonDisabled, isDialogRootOpen, testMountGlobals } from './helpers';
import { tripDetails, trips } from './mocks/planning.mock';

describe('Planning Page', async () => {
  describe('PlanningSettings.vue', async () => {
    let wrapper: VueWrapper<any>;

    beforeEach(async () => {
      wrapper = await mountSuspended(PlanningSettings, {
        global: testMountGlobals({
          planning: {
            data: { trips: [] },
            pageLoading: false,
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

    it('keeps the trip select controlled by selectedTripId', async () => {
      const store = usePlanningStore();
      store.$patch({ data: { trips }, selectedTripId: String(trips[1]?.id) });
      await wrapper.vm.$nextTick();

      const select = wrapper.findComponent({ name: 'SelectRoot' });
      expect(select.props('modelValue'))
        .toBe(String(trips[1]?.id));
      expect(select.props('defaultValue'))
        .toBeUndefined();
    });

    it('disables New Trip button when isPaidMember is false and data.trips length is greater than or equal to 1', async () => {
      const store = usePlanningStore();
      const userStore = useUserStore();

      store.$patch({ data: { trips }, pageLoading: false });
      userStore.$patch({
        profile: {
          id: trips[0]?.profile_id,
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

    it('does not block New Trip when the only trips are accepted invites', async () => {
      const store = usePlanningStore();
      const userStore = useUserStore();
      const invitedOnly = trips.map((trip) => ({
        ...trip,
        profile_id: 'someone-else',
      }));

      store.$patch({ data: { trips: invitedOnly }, pageLoading: false });
      userStore.$patch({
        profile: {
          id: 'invitee-user',
          subscriptions: [{ prices: { identifier: 'FREE' } }],
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
            data: { trips: [] },
            pageLoading: false,
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
            data: { trip_details: [] },
            pageLoading: false,
          },
        }),
      });
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.innerHTML = '';
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

    it('still shows origin, destination, and description when hike details are empty', async () => {
      const store = usePlanningStore();
      store.$patch({
        data: { trip_details: [], trips },
        pageLoading: false,
        selectedTripId: String(trips[0]?.id),
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.text())
        .toContain('Starting point');
      expect(wrapper.text())
        .toContain('Ending point');
      expect(wrapper.text())
        .toContain(trips[0]?.description);
      expect(wrapper.find('[data-testid="hike-details-empty-state"]')
        .exists())
        .toBe(true);
    });

    it('uses distinct starting and ending point placeholders', async () => {
      const store = usePlanningStore();
      store.$patch({
        data: { trip_details: tripDetails, trips },
        pageLoading: false,
        selectedTripId: String(trips[0]?.id),
      });
      await wrapper.vm.$nextTick();

      const placeSearches = wrapper.findAllComponents({ name: 'GcPlaceSearch' });
      expect(placeSearches[0]?.props('placeholder'))
        .toBe('Starting point');
      expect(placeSearches[1]?.props('placeholder'))
        .toBe('Ending point');
    });

    it('renders the Create New Detail icon button if hike details are present', async () => {
      const store = usePlanningStore();
      const userStore = useUserStore();
      store.$patch({
        data: { trip_details: tripDetails, trips },
        pageLoading: false,
        selectedTripId: String(trips[0]?.id),
      });
      userStore.$patch({
        profile: { id: trips[0]?.profile_id } as any,
      });
      await wrapper.vm.$nextTick();

      const createDetailButton = wrapper.find('[data-testid="create-new-detail-btn"]');
      expect(createDetailButton.exists())
        .toBe(true);
    });

    it('lets an accepted invitee add hike details', async () => {
      const store = usePlanningStore();
      const userStore = useUserStore();
      const sessionUserId = trips[0]!.profile_id as string;
      store.data.trips = [{ ...trips[0]!, profile_id: 'someone-else' }];
      store.data.trip_details = tripDetails;
      store.selectedTripId = String(trips[0]?.id);
      store.pageLoading = false;
      // Nested profile types on ExtendedTripFriend hit TS2589 if assigned structurally.
      (store.data as { friends: Array<{ profile_id: string; status: string }> }).friends = [{
        profile_id: sessionUserId,
        status: 'ACCEPTED',
      }];
      userStore.$patch({
        profile: { id: sessionUserId } as any,
      });
      await wrapper.vm.$nextTick();

      const createDetailButton = wrapper.find('[data-testid="create-new-detail-btn"]');
      expect(createDetailButton.exists())
        .toBe(true);
    });

    it('opens the edit dialog when clicking a New detail', async () => {
      wrapper.unmount();
      wrapper = await mountSuspended(HikeDetailsWidget, {
        attachTo: document.body,
        global: testMountGlobals({
          planning: {
            data: { trip_details: tripDetails, trips },
            pageLoading: false,
            selectedTripId: String(trips[0]?.id),
          },
          user: { profile: { id: trips[0]?.profile_id } },
        }),
      });

      await wrapper.get('[data-testid="edit-detail"]')
        .trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(document.body.textContent)
        .toContain('Edit Hike Detail');
      expect(document.body.querySelector('[data-testid="modify-detail-dialog"]'))
        .toBeTruthy();
    });

    it('opens a create dialog from the plus button without inserting a detail', async () => {
      wrapper.unmount();
      wrapper = await mountSuspended(HikeDetailsWidget, {
        attachTo: document.body,
        global: testMountGlobals({
          planning: {
            data: { trip_details: tripDetails, trips },
            pageLoading: false,
            selectedTripId: String(trips[0]?.id),
          },
          user: { profile: { id: trips[0]?.profile_id } },
        }),
      });
      const store = usePlanningStore();
      const createSpy = vi.spyOn(store, 'createTripDetail');

      await wrapper.get('[data-testid="create-new-detail-btn"]')
        .trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(createSpy)
        .not
        .toHaveBeenCalled();
      expect(store.data.trip_details)
        .toHaveLength(tripDetails.length);
      expect(document.body.textContent)
        .toContain('Create Hike Detail');
      expect(document.body.textContent)
        .not
        .toContain('Edit Hike Detail');
      expect(document.body.querySelector('[data-testid="delete-detail"]'))
        .toBeNull();
      expect(document.body.querySelector('[data-testid="create-detail"]'))
        .toBeTruthy();
    });

    it('opens a create dialog from Get Started without inserting a detail', async () => {
      wrapper.unmount();
      wrapper = await mountSuspended(HikeDetailsWidget, {
        attachTo: document.body,
        global: testMountGlobals({
          planning: {
            data: { trip_details: [], trips },
            pageLoading: false,
            selectedTripId: String(trips[0]?.id),
          },
          user: { profile: { id: trips[0]?.profile_id } },
        }),
      });
      const store = usePlanningStore();
      const createSpy = vi.spyOn(store, 'createTripDetail');

      const getStarted = wrapper.get('[data-testid="hike-details-empty-state"]')
        .find('button');
      expect(getStarted.exists())
        .toBe(true);
      await getStarted.trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(createSpy)
        .not
        .toHaveBeenCalled();
      expect(store.data.trip_details)
        .toHaveLength(0);
      expect(document.body.textContent)
        .toContain('Create Hike Detail');
    });
  });

  describe('TripDetailsWidget.vue', async () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('shows trip dates even when there are no trip detail rows', async () => {
      const wrapper = await mountSuspended(TripDetailsWidget, {
        global: testMountGlobals({
          planning: {
            data: { trip_details: [], trips },
            pageLoading: false,
            selectedTripId: String(trips[1]?.id),
          },
        }),
      });

      expect(wrapper.text())
        .toContain(trips[1]?.name);
      expect(wrapper.text())
        .toContain('Apr 1, 2024');
      expect(wrapper.text())
        .toContain('Sep 5, 2024');
      expect(wrapper.text())
        .toContain("You haven't added any trip details yet!");
    });

    it('opens the edit dialog when clicking a New trip detail', async () => {
      const wrapper = await mountSuspended(TripDetailsWidget, {
        attachTo: document.body,
        global: testMountGlobals({
          planning: {
            data: { trip_details: tripDetails, trips },
            pageLoading: false,
            selectedTripId: String(trips[0]?.id),
          },
          user: { profile: { id: trips[0]?.profile_id } },
        }),
      });

      await wrapper.get('[data-testid="edit-detail"]')
        .trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(document.body.textContent)
        .toContain('Edit Trip Detail');
      wrapper.unmount();
    });

    it('opens a create dialog from the plus button without inserting a detail', async () => {
      const wrapper = await mountSuspended(TripDetailsWidget, {
        attachTo: document.body,
        global: testMountGlobals({
          planning: {
            data: { trip_details: tripDetails, trips },
            pageLoading: false,
            selectedTripId: String(trips[0]?.id),
          },
          user: { profile: { id: trips[0]?.profile_id } },
        }),
      });
      const store = usePlanningStore();
      const createSpy = vi.spyOn(store, 'createTripDetail');

      await wrapper.get('[data-testid="create-trip-detail-btn"]')
        .trigger('click');
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(createSpy)
        .not
        .toHaveBeenCalled();
      expect(store.data.trip_details)
        .toHaveLength(tripDetails.length);
      expect(document.body.textContent)
        .toContain('Create Trip Detail');
      expect(document.body.textContent)
        .not
        .toContain('Edit Trip Detail');
      expect(document.body.querySelector('[data-testid="delete-detail"]'))
        .toBeNull();
      expect(document.body.querySelector('[data-testid="create-detail"]'))
        .toBeTruthy();
      wrapper.unmount();
    });
  });

  describe('ModifyDetailDialog.vue', async () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('renders the dialog when open with an active detail', async () => {
      const wrapper = await mountSuspended(ModifyDetailDialog, {
        attachTo: document.body,
        global: testMountGlobals({
          planning: {
            data: { trip_details: tripDetails },
            pageLoading: false,
          },
        }),
        props: {
          activeDetail: tripDetails[0]!,
          isOpen: true,
        },
      });

      expect(isDialogRootOpen(wrapper))
        .toBe(true);
      expect(document.body.textContent)
        .toContain('Edit Hike Detail');
      wrapper.unmount();
    });

    it('shows the URL field after checking Link to URL', async () => {
      const wrapper = await mountSuspended(ModifyDetailDialog, {
        attachTo: document.body,
        global: testMountGlobals(),
        props: {
          activeDetail: tripDetails[0]!,
          isOpen: true,
        },
      });

      expect(document.body.querySelector('[data-testid="detail-url"]'))
        .toBeNull();

      const checkbox = document.body.querySelector('[data-testid="detail-has-url"]') as HTMLElement;
      expect(checkbox)
        .toBeTruthy();
      checkbox.click();
      await vi.waitFor(() => {
        expect(document.body.querySelector('[data-testid="detail-url"]'))
          .toBeTruthy();
      });
      wrapper.unmount();
    });

    it('renders a create dialog without a Delete action', async () => {
      const wrapper = await mountSuspended(ModifyDetailDialog, {
        attachTo: document.body,
        global: testMountGlobals({
          planning: {
            data: { trip_details: [] },
            pageLoading: false,
          },
        }),
        props: {
          detailType: TripDetailsType.HIKE,
          isOpen: true,
          mode: 'create',
        },
      });

      expect(isDialogRootOpen(wrapper))
        .toBe(true);
      expect(document.body.textContent)
        .toContain('Create Hike Detail');
      expect(document.body.textContent)
        .not
        .toContain('Edit Hike Detail');
      expect(document.body.querySelector('[data-testid="delete-detail"]'))
        .toBeNull();
      expect(document.body.querySelector('[data-testid="create-detail"]'))
        .toBeTruthy();
      wrapper.unmount();
    });

    it('creates a detail then closes', async () => {
      const wrapper = await mountSuspended(ModifyDetailDialog, {
        attachTo: document.body,
        global: testMountGlobals(),
        props: {
          detailType: TripDetailsType.TRIP,
          isOpen: true,
          mode: 'create',
        },
      });
      const store = usePlanningStore();
      const created = { ...tripDetails[1]!, id: 99, title: 'Campsite notes' };
      const createSpy = vi.spyOn(store, 'createTripDetail')
        .mockResolvedValue(created);

      const titleInput = document.body.querySelector('input[name="title"]') as HTMLInputElement;
      expect(titleInput)
        .toBeTruthy();
      titleInput.value = 'Campsite notes';
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wrapper.vm.$nextTick();

      const createButton = document.body.querySelector('[data-testid="create-detail"]') as HTMLButtonElement;
      expect(createButton)
        .toBeTruthy();
      createButton.click();
      await vi.waitFor(() => {
        expect(createSpy)
          .toHaveBeenCalled();
      });

      expect(createSpy)
        .toHaveBeenCalledWith(expect.objectContaining({
          title: 'Campsite notes',
          type: TripDetailsType.TRIP,
          url: null,
        }));
      expect(wrapper.emitted('onClose'))
        .toBeTruthy();
      wrapper.unmount();
    });

    it('updates a detail then closes', async () => {
      const wrapper = await mountSuspended(ModifyDetailDialog, {
        attachTo: document.body,
        global: testMountGlobals(),
        props: {
          activeDetail: tripDetails[0]!,
          isOpen: true,
        },
      });
      const store = usePlanningStore();
      const updateSpy = vi.spyOn(store, 'updateTripDetail')
        .mockResolvedValue(true);

      const updateButton = document.body.querySelector('[data-testid="update-detail"]') as HTMLButtonElement;
      expect(updateButton)
        .toBeTruthy();
      updateButton.click();
      await vi.waitFor(() => {
        expect(updateSpy)
          .toHaveBeenCalled();
      });

      expect(updateSpy)
        .toHaveBeenCalledWith(tripDetails[0]!.id, expect.objectContaining({
          title: tripDetails[0]!.title,
          url: null,
        }));
      expect(wrapper.emitted('onClose'))
        .toBeTruthy();
      wrapper.unmount();
    });

    it('deletes a detail then closes', async () => {
      const wrapper = await mountSuspended(ModifyDetailDialog, {
        attachTo: document.body,
        global: testMountGlobals(),
        props: {
          activeDetail: tripDetails[1]!,
          isOpen: true,
        },
      });
      const store = usePlanningStore();
      const deleteSpy = vi.spyOn(store, 'deleteTripDetail')
        .mockResolvedValue(true);

      const deleteButton = document.body.querySelector('[data-testid="delete-detail"]') as HTMLButtonElement;
      expect(deleteButton)
        .toBeTruthy();
      deleteButton.click();
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(deleteSpy)
        .toHaveBeenCalledWith(tripDetails[1]!.id);
      expect(wrapper.emitted('onClose'))
        .toBeTruthy();
      wrapper.unmount();
    });
  });
});
