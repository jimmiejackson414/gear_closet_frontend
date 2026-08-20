import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicPackPage from '@/pages/p/packs/[slug].vue';
import { useClosetStore } from '@/stores/closet';
import { selectedPack } from '@/tests/unit/mocks/closet.mock';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import type { PublicPack } from '@/types/closet';

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

vi.mock('@/utils/avatar', () => ({
  buildImageSrc: vi.fn((url: string) => url),
}));

vi.mock('@/utils/displayName', () => ({
  initials: vi.fn(() => 'GC'),
  friendlyUsername: vi.fn((user) => {
    if (!user) return '';
    return user.trail_name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }),
}));

const supabaseUser = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue');
  return ref<{ sub: string } | null>(null);
});

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

const publicProfile = {
  id: selectedPack.profile_id,
  first_name: 'Pat',
  last_name: 'Packer',
  trail_name: 'Trailfox',
  image: null,
  email: 'pat@example.com',
  role: 'USER',
  measuring_system: 'IMPERIAL',
  needs_free_resource_selection: false,
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
  slug: 'pat-packer',
};

describe('pages/p/packs/[slug]', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    supabaseUser.value = null;
    routeSlug.value = 'test-pack-slug';
    supabaseClient.current = createSupabaseMock();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const gateDialogText = () =>
    document.querySelector('[role="alertdialog"]')?.textContent ?? '';

  it('gates private packs with private messaging and navigation CTAs', async () => {
    const privatePack = {
      ...structuredClone(selectedPack),
      private: true,
      profile: publicProfile,
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
    expect((wrapper.vm as any).packGateReason)
      .toBe('private');
    expect(gateDialogText())
      .toContain('This pack is private');
    expect(gateDialogText())
      .not
      .toContain('Pack not found');
    expect(gateDialogText())
      .toContain('Home');
    expect(gateDialogText())
      .toContain('Sign in');
    expect(gateDialogText())
      .toContain('Browse');
  });

  it('gates missing packs with not-found messaging', async () => {
    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: null, error: null }),
    });

    const wrapper = await mountSuspended(PublicPackPage);
    const closet = useClosetStore();

    expect(closet.data.selectedPack)
      .toBeUndefined();
    expect((wrapper.vm as any).packGateReason)
      .toBe('not_found');
    expect(gateDialogText())
      .toContain('Pack not found');
    expect(gateDialogText())
      .not
      .toContain('This pack is private');
    expect(gateDialogText())
      .toContain('Home');
    expect(gateDialogText())
      .toContain('Sign in');
  });

  it('loads a public pack without crashing', async () => {
    const publicPack = {
      ...structuredClone(selectedPack),
      private: false,
      name: 'Shared Summer',
      profile: publicProfile,
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
      .toContain('This pack is private');
    expect(wrapper.text())
      .not
      .toContain('Pack not found');
  });

  it('explains when comments are disabled', async () => {
    const publicPack = {
      ...structuredClone(selectedPack),
      private: false,
      allow_comments: false,
      name: 'Quiet Pack',
      profile: publicProfile,
      comments: [],
      categories: [],
    } as PublicPack;

    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: publicPack, error: null }),
    });

    const wrapper = await mountSuspended(PublicPackPage);

    expect(wrapper.text())
      .toContain('The pack owner has turned off comments for this pack.');
  });
});
