import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PublicPackPage from '@/pages/p/packs/[slug].vue';
import { useClosetStore } from '@/stores/closet';
import { selectedPack } from '@/tests/unit/mocks/closet.mock';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import type { PublicPack } from '@/types/helpers';

vi.mock('@/components/public/packs/PublicPackComment.vue', () => ({
  default: {
    name: 'PublicPackComment',
    props: ['comment'],
    template: '<div data-testid="stub-comment" />',
  },
}));

vi.mock('@/components/closet/ClosetPackChart.vue', () => ({
  default: { name: 'ClosetPackChart', template: '<div data-testid="stub-chart" />' },
}));

vi.mock('@/components/closet/ClosetPackDetails.vue', () => ({
  default: { name: 'ClosetPackDetails', template: '<div data-testid="stub-details" />' },
}));

vi.mock('@/components/closet/ClosetPackCategories.vue', () => ({
  default: { name: 'ClosetPackCategories', template: '<div data-testid="stub-categories" />' },
}));

vi.mock('@/utils/helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/helpers')>();
  return {
    ...actual,
    buildImageSrc: vi.fn((url: string) => url),
    initials: vi.fn(() => 'GC'),
    friendlyUsername: vi.fn((user) => {
      if (!user) return '';
      return user.trail_name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }),
  };
});

const supabaseUser = vi.hoisted(() => ({
  value: null as { sub: string } | null,
}));

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

const routeSlug = vi.hoisted(() => ({
  value: 'test-pack-slug',
}));

mockNuxtImport('useSupabaseUser', () => () => supabaseUser);
mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);
mockNuxtImport('useRoute', () => () => ({
  params: { slug: routeSlug.value },
  meta: { public: true },
}));

describe('pages/p/packs/[slug]', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    supabaseUser.value = null;
    routeSlug.value = 'test-pack-slug';
    supabaseClient.current = createSupabaseMock();
  });

  it('gates private packs with a warning and clears selected pack', async () => {
    const privatePack = {
      ...structuredClone(selectedPack),
      private: true,
      profile: {
        id: selectedPack.profile_id,
        first_name: 'Pat',
        last_name: 'Packer',
        trail_name: 'Trailfox',
        image: null,
      },
      comments: [],
    };

    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: privatePack, error: null }),
    });

    const wrapper = await mountSuspended(PublicPackPage);
    const closet = useClosetStore();

    expect(closet.data.selectedPack)
      .toBeUndefined();
    expect(closet.pageLoading)
      .toBe(false);
    expect((wrapper.vm as any).displayPrivatePackWarning)
      .toBe(true);
    expect(document.body.textContent)
      .toContain('This pack is private!');
  });

  it('gates missing packs the same way', async () => {
    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: null, error: null }),
    });

    const wrapper = await mountSuspended(PublicPackPage);
    const closet = useClosetStore();

    expect(closet.data.selectedPack)
      .toBeUndefined();
    expect((wrapper.vm as any).displayPrivatePackWarning)
      .toBe(true);
    expect(document.body.textContent)
      .toContain('This pack is private!');
  });

  it('loads a public pack without crashing', async () => {
    const publicPack = {
      ...structuredClone(selectedPack),
      private: false,
      name: 'Shared Summer',
      profile: {
        id: selectedPack.profile_id,
        first_name: 'Pat',
        last_name: 'Packer',
        trail_name: 'Trailfox',
        image: null,
        email: null,
        role: 'USER',
        measuring_system: 'IMPERIAL',
        onboard_date: null,
        address_1: null,
        address_2: null,
        city: null,
        state: null,
        country: null,
        created_at: null,
        updated_at: null,
        deactivated_at: null,
        location: null,
        fts: null,
        slug: null,
      },
      comments: [],
      categories: [],
    } as PublicPack;

    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: publicPack, error: null }),
    });

    const wrapper = await mountSuspended(PublicPackPage);
    const closet = useClosetStore();

    expect(closet.data.selectedPack?.name)
      .toBe('Shared Summer');
    expect(wrapper.text())
      .toContain('Shared Summer Pack');
    expect(wrapper.text())
      .not
      .toContain('This pack is private!');
  });
});
