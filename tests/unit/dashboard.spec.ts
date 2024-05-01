import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import UpcomingTripsWidget from '@/components/dashboard/UpcomingTripsWidget.vue';
import GcSkeleton from '@/components/common/GcSkeleton.vue';
import { upcomingTrips } from './mocks/dashboard.mock';

describe('Dashboard', async () => {
  // ************************** //
  // UpcomingTripsWidget states //
  // ************************** //
  it('renders the loading state for the UpcomingTripsWidget', async () => {
    const wrapper = await mountSuspended(UpcomingTripsWidget, {
      props: {
        data: [],
        loading: true,
      },
    });
    const skeleton = wrapper.findComponent(GcSkeleton);
    expect(skeleton.exists())
      .toBe(true);
  });

  it('renders the empty state for the UpcomingTripsWidget', async () => {
    const wrapper = await mountSuspended(UpcomingTripsWidget, {
      props: {
        data: [],
        loading: false,
      },
    });
    expect(wrapper.text())
      .toContain('You don\'t have any upcoming trips yet!');
  });

  it('renders upcoming trips correctly', async () => {
    const wrapper = await mountSuspended(UpcomingTripsWidget, {
      props: {
        data: upcomingTrips,
        loading: false,
      },
    });

    const tripElements = wrapper.findAll('li');

    expect(tripElements.length)
      .toBe(upcomingTrips.length);

    tripElements.forEach((tripElement, index) => {
      expect(tripElement.text())
        .toContain(upcomingTrips[index].name);
    });
  });
});