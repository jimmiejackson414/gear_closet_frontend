import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TripWeatherWidget from '@/components/planning/widgets/TripWeatherWidget.vue';
import { usePlanningStore } from '@/stores/planning';
import { testMountGlobals } from './helpers';
import { trips } from './mocks/planning.mock';

const fetchMock = vi.hoisted(() => vi.fn());

mockNuxtImport('$fetch', () => fetchMock);

const forecast = {
  status: 'forecast' as const,
  units: 'imperial' as const,
  places: [{
    kind: 'origin' as const,
    placeLabel: 'Springer Mountain',
    currentAirQuality: null,
    days: [{
      date: '2026-08-26',
      high: 70,
      low: 50,
      precipChance: 10,
      weatherCode: 0,
      airQuality: null,
    }],
  }],
};

describe('TripWeatherWidget', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(forecast);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('uses the same title styling as other planning widgets', async () => {
    const wrapper = await mountSuspended(TripWeatherWidget, {
      props: { tripId: trips[0]!.id },
      global: testMountGlobals({
        planning: {
          selectedTripId: String(trips[0]!.id),
          data: { trips },
        },
      }),
    });

    const title = wrapper.get('[data-testid="trip-weather-widget"] p');
    expect(title.text())
      .toBe('Weather');
    expect(title.classes())
      .toEqual(expect.arrayContaining(['font-bold!', 'text-base']));
    wrapper.unmount();
  });

  it('refetches weather when the starting or ending point changes', async () => {
    const wrapper = await mountSuspended(TripWeatherWidget, {
      props: { tripId: trips[0]!.id },
      global: testMountGlobals({
        planning: {
          selectedTripId: String(trips[0]!.id),
          data: {
            trips: [{
              ...trips[0]!,
              origin_lat: 34.6265,
              origin_lng: -84.1938,
              starting_point: 'Springer Mountain',
            }],
          },
        },
      }),
    });
    const store = usePlanningStore();

    await vi.waitFor(() => {
      expect(fetchMock)
        .toHaveBeenCalled();
    });
    const callsAfterMount = fetchMock.mock.calls.length;

    store.data.trips.splice(0, 1, {
      ...store.data.trips[0]!,
      origin_lat: 48.75,
      origin_lng: -121.68,
      starting_point: 'Hannegan Trailhead',
    });
    await vi.waitFor(() => {
      expect(fetchMock.mock.calls.length)
        .toBe(callsAfterMount + 1);
    });

    store.data.trips.splice(0, 1, {
      ...store.data.trips[0]!,
      destination_lat: 45.9044,
      destination_lng: -68.9213,
      ending_point: 'Mount Katahdin',
    });
    await vi.waitFor(() => {
      expect(fetchMock.mock.calls.length)
        .toBe(callsAfterMount + 2);
    });

    wrapper.unmount();
  });
});
