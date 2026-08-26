import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it } from 'vitest';
import PlanningContent from '@/components/planning/PlanningContent.vue';
import { testMountGlobals } from './helpers';
import { trips } from './mocks/planning.mock';

const sidebarStubs = {
  HikeDetailsWidget: true,
  PackWidget: true,
  PollWidget: true,
  ShoppingListWidget: true,
  TodosWidget: true,
  TripDetailsWidget: true,
  TripFriendsWidget: true,
  TripWeatherWidget: true,
};

describe('PlanningContent', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps weather under hike details in the main column', async () => {
    const wrapper = await mountSuspended(PlanningContent, {
      global: {
        ...testMountGlobals({
          planning: {
            data: { trips },
            pageLoading: false,
            selectedTripId: String(trips[0]!.id),
          },
        }),
        stubs: sidebarStubs,
      },
    });

    const weather = wrapper.get('[data-testid="planning-weather-slot"]');
    expect(wrapper.get('[data-testid="planning-sidebar"]')
      .find('[data-testid="planning-weather-slot"]')
      .exists())
      .toBe(false);

    const previous = weather.element.previousElementSibling;
    expect(previous?.tagName.toLowerCase())
      .toContain('hike-details');

    wrapper.unmount();
  });
});
