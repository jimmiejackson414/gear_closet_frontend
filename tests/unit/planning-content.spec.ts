import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PlanningContent from '@/components/planning/PlanningContent.vue';
import { testMountGlobals } from './helpers';
import { trips } from './mocks/planning.mock';

const fetchMock = vi.hoisted(() => vi.fn());

mockNuxtImport('$fetch', () => fetchMock);

const sidebarStubs = {
  HikeDetailsWidget: true,
  PackWidget: true,
  PollWidget: true,
  ShoppingListWidget: true,
  TodosWidget: true,
  TripDetailsWidget: true,
  TripFriendsWidget: true,
};

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

async function mountPlanningContent () {
  return mountSuspended(PlanningContent, {
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
}

describe('PlanningContent', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps weather below todos and shopping until a forecast is fetched', async () => {
    fetchMock.mockResolvedValue({ status: 'needs_place' });
    const wrapper = await mountPlanningContent();

    await vi.waitFor(() => {
      expect(wrapper.get('[data-testid="planning-weather-slot"]')
        .classes())
        .toContain('order-4');
    });
    expect(wrapper.get('[data-testid="planning-todos-slot"]')
      .classes())
      .toContain('order-2');
    expect(wrapper.get('[data-testid="planning-shopping-slot"]')
      .classes())
      .toContain('order-3');
    wrapper.unmount();
  });

  it('moves weather above todos after a forecast is fetched', async () => {
    fetchMock.mockResolvedValue(forecast);
    const wrapper = await mountSuspended(PlanningContent, {
      global: {
        ...testMountGlobals({
          planning: {
            data: {
              trips: [{
                ...trips[0]!,
                starting_date: '2026-08-30T00:00:00Z',
              }],
            },
            pageLoading: false,
            selectedTripId: String(trips[0]!.id),
          },
        }),
        stubs: sidebarStubs,
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.get('[data-testid="planning-weather-slot"]')
        .classes())
        .toContain('order-2');
    });
    expect(wrapper.get('[data-testid="planning-todos-slot"]')
      .classes())
      .toContain('order-3');
    expect(wrapper.get('[data-testid="planning-shopping-slot"]')
      .classes())
      .toContain('order-4');
    wrapper.unmount();
  });
});
