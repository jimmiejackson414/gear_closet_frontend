import { ref, type Ref } from 'vue';
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

vi.mock('@/utils/avatar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/avatar')>();
  return {
    ...actual,
    buildImageSrc: vi.fn((url: string) => url),
  };
});

vi.mock('@/utils/displayName', () => ({
  friendlyUsername: vi.fn((user) => {
    if (!user) return '';
    return user.trail_name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }),
  initials: vi.fn(() => 'GC'),
}));

const supabaseUser = vi.hoisted(() => ({
  current: undefined as Ref<{ sub: string } | null> | undefined,
}));

supabaseUser.current = ref<{ sub: string } | null>(null);

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

const routeSlug = vi.hoisted(() => ({
  value: 'test-pack-slug',
}));

const routeQuery = vi.hoisted(() => ({
  value: {} as Record<string, string>,
}));

const redirectPath = vi.hoisted(() => ({
  value: null as string | null,
}));

mockNuxtImport('useSupabaseUser', () => () => supabaseUser.current);
mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);
mockNuxtImport('useSupabaseCookieRedirect', () => () => ({
  path: redirectPath,
  pluck: () => {
    const saved = redirectPath.value;
    redirectPath.value = null;
    return saved;
  },
}));
mockNuxtImport('useRoute', () => () => ({
  meta: { public: true },
  params: { slug: routeSlug.value },
  query: routeQuery.value,
}));

const publicProfile = {
  address_1: null,
  address_2: null,
  city: null,
  country: null,
  created_at: null,
  deactivated_at: null,
  email: 'pat@example.com',
  first_name: 'Pat',
  fts: null,
  id: selectedPack.profile_id,
  image: null,
  last_name: 'Packer',
  location: null,
  measuring_system: 'IMPERIAL',
  needs_free_resource_selection: false,
  onboard_date: null,
  role: 'USER',
  slug: 'pat-packer',
  state: null,
  trail_name: 'Trailfox',
  updated_at: null,
};

describe('pages/p/packs/[slug]', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    supabaseUser.current!.value = null;
    routeSlug.value = 'test-pack-slug';
    routeQuery.value = {};
    redirectPath.value = null;
    supabaseClient.current = createSupabaseMock();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const gateDialogText = () =>
    document.querySelector('[role="alertdialog"]')?.textContent ?? '';

  it('does not leak a private pack to guests', async () => {
    const privatePack = {
      ...structuredClone(selectedPack),
      comments: [],
      private: true,
      profile: publicProfile,
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
      .toBe('not_found');
    expect(gateDialogText())
      .toContain('Pack not found');
    expect(gateDialogText())
      .not
      .toContain('This pack is private');
  });

  it('lets a signed-in trip member view a private pack', async () => {
    supabaseUser.current!.value = { sub: 'trip-mate-id' };
    const privatePack = {
      ...structuredClone(selectedPack),
      categories: [],
      comments: [],
      name: 'Trail Private',
      private: true,
      profile: publicProfile,
    } as PublicPack;

    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: privatePack, error: null }),
    });

    const wrapper = await mountSuspended(PublicPackPage);
    const closet = useClosetStore();

    expect(closet.data.selectedPack?.name)
      .toBe('Trail Private');
    expect(wrapper.text())
      .toContain('Trail Private Pack');
    expect(wrapper.text())
      .not
      .toContain('Pack not found');
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
      categories: [],
      comments: [],
      name: 'Shared Summer',
      private: false,
      profile: publicProfile,
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
      allow_comments: false,
      categories: [],
      comments: [],
      name: 'Quiet Pack',
      private: false,
      profile: publicProfile,
    } as PublicPack;

    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: publicPack, error: null }),
    });

    const wrapper = await mountSuspended(PublicPackPage);

    expect(wrapper.text())
      .toContain('The pack owner has turned off comments for this pack.');
  });

  it('stores a return path for guests visiting a public pack', async () => {
    const publicPack = {
      ...structuredClone(selectedPack),
      allow_comments: true,
      categories: [],
      comments: [],
      name: 'Shared Summer',
      private: false,
      profile: publicProfile,
    } as PublicPack;

    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: publicPack, error: null }),
    });

    await mountSuspended(PublicPackPage);

    expect(redirectPath.value)
      .toBe('/p/packs/test-pack-slug');
  });

  it('stores the comments tab in the return path when signing in from comments', async () => {
    routeQuery.value = { tab: 'comments' };

    const publicPack = {
      ...structuredClone(selectedPack),
      allow_comments: true,
      categories: [],
      comments: [],
      name: 'Shared Summer',
      private: false,
      profile: publicProfile,
    } as PublicPack;

    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: publicPack, error: null }),
    });

    const wrapper = await mountSuspended(PublicPackPage);
    redirectPath.value = '/p/packs/test-pack-slug';

    await wrapper.find('[data-testid="public-pack-sign-in"]')
      .trigger('click');

    expect(redirectPath.value)
      .toBe('/p/packs/test-pack-slug?tab=comments');
  });

  it('opens the comments tab when returning with ?tab=comments', async () => {
    routeQuery.value = { tab: 'comments' };

    const publicPack = {
      ...structuredClone(selectedPack),
      allow_comments: true,
      categories: [],
      comments: [],
      name: 'Shared Summer',
      private: false,
      profile: publicProfile,
    } as PublicPack;

    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: publicPack, error: null }),
    });

    const wrapper = await mountSuspended(PublicPackPage);

    expect(redirectPath.value)
      .toBe('/p/packs/test-pack-slug?tab=comments');
    expect(wrapper.find('[data-testid="public-pack-sign-in"]')
      .exists())
      .toBe(true);
  });
});
