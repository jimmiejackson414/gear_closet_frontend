import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import UpcomingTripsWidget from '@/components/dashboard/UpcomingTripsWidget.vue';

describe('Dashboard', async () => {
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
});