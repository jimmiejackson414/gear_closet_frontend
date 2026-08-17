import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileContent from '@/components/profile/ProfileContent.vue';
import { useUserStore } from '@/stores/user';
import { profile } from '@/tests/unit/mocks/app.mock';
import { createSupabaseMock, createThenableQuery } from '@/tests/unit/mocks/supabase.mock';

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock('@/components/common/GcAvatarUpload.vue', () => ({
  default: {
    name: 'GcAvatarUpload',
    props: ['file'],
    template: '<div data-testid="stub-avatar-upload" />',
  },
}));

const fetchMock = vi.hoisted(() => vi.fn());

vi.stubGlobal('$fetch', fetchMock);

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);

describe('components/profile/ProfileContent', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    fetchMock.mockReset();
    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: null, error: null }),
    });

    const userStore = useUserStore();
    const { subscriptions: _s, ...profileWithoutSubscription } = profile;
    userStore.profile = {
      ...profileWithoutSubscription,
      subscriptions: [],
    } as any;
  });

  it('shows a Free subscription pill when the profile has no subscription row', async () => {
    const wrapper = await mountSuspended(ProfileContent);

    expect(wrapper.text())
      .toContain('Free Subscription');
  });

  it('loads the subscription tab without error when Stripe billing is missing', async () => {
    fetchMock.mockRejectedValue({
      statusCode: 404,
      statusMessage: 'No billing customer on file',
    });

    const wrapper = await mountSuspended(ProfileContent);
    const vm = wrapper.vm as any;

    vm.activeTab = 'subscription';
    await vm.fetchSubscriptionData();
    await wrapper.vm.$nextTick();

    expect(vm.displayedSubscriptionPlan)
      .toBe('Free');
    expect(vm.hasStripeBilling)
      .toBe(false);
    expect(wrapper.text())
      .toContain('Billing details appear here after you subscribe to a paid plan.');
  });
});
