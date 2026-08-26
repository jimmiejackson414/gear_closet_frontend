import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PackWidget from '@/components/planning/widgets/PackWidget.vue';
import { usePlanningStore } from '@/stores/planning';
import { selectedPack } from '@/tests/unit/mocks/closet.mock';
import { tripFriends, trips } from '@/tests/unit/mocks/planning.mock';
import { createSupabaseMock } from '@/tests/unit/mocks/supabase.mock';
import { testMountGlobals } from './helpers';
import type { VueWrapper } from '@vue/test-utils';

vi.mock('vue-echarts', () => ({
  default: {
    name: 'VChart',
    props: ['option', 'autoresize'],
    template: '<div data-testid="pack-chart-stub" />',
  },
}));

const OWNER_ID = '61b66be5-d199-48d5-898a-c521dd6b59cc';
const FRIEND_ID = tripFriends[0]!.profile_id;

const supabaseUser = vi.hoisted(() => ({
  value: { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' } as { sub: string } | null,
}));

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

mockNuxtImport('useSupabaseUser', () => () => supabaseUser);
mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);
mockNuxtImport('hslVarToHex', () => async () => '#000000');
mockNuxtImport('useColorMode', () => () => ({
  preference: 'light',
  value: 'light',
}));

const friendPack = {
  ...selectedPack,
  id: 99,
  name: 'Junebug Pack',
  profile_id: FRIEND_ID,
  slug: 'junebug-pack-slug',
};

const planningState = {
  data: {
    friends: [],
    pack: selectedPack,
    party_packs: [{
      display_name: 'Shelly Borga',
      pack: friendPack,
      profile_id: FRIEND_ID,
    }],
    pending_invites: [],
    shopping_items: [],
    todos: [],
    trip_details: [],
    trips,
  },
  pageLoading: false,
  selectedTripId: String(trips[0]!.id),
};

const dialogStubs = {
  ChangePackDialog: true,
  ChangePackThemeDialog: true,
  LazyChangePackDialog: true,
  LazyChangePackThemeDialog: true,
};

const mountPackWidget = () => mountSuspended(PackWidget, {
  global: {
    ...testMountGlobals({
      planning: planningState,
      user: { profile: { id: OWNER_ID } },
    }),
    stubs: dialogStubs,
  },
});

describe('PackWidget', () => {
  let wrapper: VueWrapper<any> | undefined;

  beforeEach(() => {
    supabaseClient.current = createSupabaseMock();
    supabaseUser.value = { sub: OWNER_ID };
  });

  afterEach(async () => {
    wrapper?.unmount();
    wrapper = undefined;
    await vi.dynamicImportSettled();
  });

  it('shows only the current user pack by default without a member switcher', async () => {
    wrapper = await mountPackWidget();

    expect(wrapper.text())
      .toContain('Summer Pack');
    expect(wrapper.text())
      .not
      .toContain('Junebug Pack');
    expect(wrapper.find('[data-testid="pack-widget-my-pack"]')
      .exists())
      .toBe(false);
    expect(wrapper.findComponent({ name: 'SelectRoot' })
      .exists())
      .toBe(false);
    expect(wrapper.find('[data-testid="pack-widget-view-full"]')
      .exists())
      .toBe(false);
  });

  it('shows a friend pack after viewTripPack and returns to My pack', async () => {
    wrapper = await mountPackWidget();
    const store = usePlanningStore();

    store.viewTripPack(FRIEND_ID);
    await wrapper.vm.$nextTick();

    expect(wrapper.text())
      .toContain('Junebug Pack');
    expect(wrapper.text())
      .toContain('Shelly Borga');
    expect(wrapper.text())
      .not
      .toContain('Summer Pack');
    expect(wrapper.get('[data-testid="pack-widget-view-full"]')
      .attributes('href'))
      .toContain('/p/packs/junebug-pack-slug');

    await wrapper.get('[data-testid="pack-widget-my-pack"]')
      .trigger('click');
    await wrapper.vm.$nextTick();

    expect(store.viewedPackProfileId)
      .toBeUndefined();
    expect(wrapper.text())
      .toContain('Summer Pack');
    expect(wrapper.find('[data-testid="pack-widget-my-pack"]')
      .exists())
      .toBe(false);
    expect(wrapper.find('[data-testid="pack-widget-view-full"]')
      .exists())
      .toBe(false);
  });
});
