import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TripWeatherWidget from '@/components/planning/widgets/TripWeatherWidget.vue';
import { usePlanningStore } from '@/stores/planning';
import { testMountGlobals } from './helpers';
import { trips } from './mocks/planning.mock';

const fetchMock = vi.hoisted(() => vi.fn());

mockNuxtImport('$fetch', () => fetchMock);

const forecast = {
  places: [{
    currentAirQuality: null,
    days: [{
      airQuality: null,
      date: '2026-08-26',
      high: 70,
      low: 50,
      precipChance: 10,
      weatherCode: 0,
    }],
    kind: 'origin' as const,
    placeLabel: 'Springer Mountain',
  }],
  status: 'forecast' as const,
  units: 'imperial' as const,
};

describe('TripWeatherWidget', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(forecast);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('uses the same title styling as other planning widgets', async () => {
    const wrapper = await mountSuspended(TripWeatherWidget, {
      global: testMountGlobals({
        planning: {
          data: { trips },
          selectedTripId: String(trips[0]!.id),
        },
      }),
      props: { tripId: trips[0]!.id },
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
      global: testMountGlobals({
        planning: {
          data: {
            trips: [{
              ...trips[0]!,
              origin_lat: 34.6265,
              origin_lng: -84.1938,
              starting_date: '2026-08-30T00:00:00Z',
              starting_point: 'Springer Mountain',
            }],
          },
          selectedTripId: String(trips[0]!.id),
        },
      }),
      props: { tripId: trips[0]!.id },
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

  it('shows column headers for the forecast table', async () => {
    const wrapper = await mountSuspended(TripWeatherWidget, {
      global: testMountGlobals({
        planning: {
          data: {
            trips: [{
              ...trips[0]!,
              origin_lat: 34.6265,
              origin_lng: -84.1938,
              starting_date: '2026-08-30T00:00:00Z',
              starting_point: 'Springer Mountain',
            }],
          },
          selectedTripId: String(trips[0]!.id),
        },
      }),
      props: { tripId: trips[0]!.id },
    });

    await vi.waitFor(() => {
      expect(wrapper.text())
        .toContain('Day');
    });
    expect(wrapper.text())
      .toContain('Precip');
    expect(wrapper.text())
      .toContain('AQI');

    wrapper.unmount();
  });

  it('does not fetch weather until a starting date is selected', async () => {
    const wrapper = await mountSuspended(TripWeatherWidget, {
      global: testMountGlobals({
        planning: {
          data: {
            trips: [{
              ...trips[0]!,
              origin_lat: 34.6265,
              origin_lng: -84.1938,
              starting_date: null,
              starting_point: 'Springer Mountain',
            }],
          },
          selectedTripId: String(trips[0]!.id),
        },
      }),
      props: { tripId: trips[0]!.id },
    });

    await wrapper.vm.$nextTick();
    expect(fetchMock)
      .not
      .toHaveBeenCalled();
    expect(wrapper.text())
      .toContain('Select a starting date for weather information.');
    const helper = wrapper.findAll('p')
      .find(node => node.text()
        .includes('Select a starting date'));
    expect(helper?.classes())
      .toEqual(expect.arrayContaining(['text-base']));
    expect(helper?.element.parentElement?.className)
      .toContain('text-muted-foreground');

    wrapper.unmount();
  });
});
