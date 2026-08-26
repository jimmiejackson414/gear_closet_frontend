import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileContent from '@/components/profile/ProfileContent.vue';
import { useUserStore } from '@/stores/user';
import { profile } from '@/tests/unit/mocks/app.mock';
import { createSupabaseMock, createThenableQuery } from '@/tests/unit/mocks/supabase.mock';

const toast = vi.hoisted(() => vi.fn());

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({ toast }),
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

function seedFreeProfile () {
  const userStore = useUserStore();
  const { subscriptions: _s, ...profileWithoutSubscription } = profile;
  // Pinia's unwrapped ProfileApiResponse is too deep for a structural assign (TS2589).
  userStore.profile = {
    ...profileWithoutSubscription,
    subscriptions: [],
  } as never;
}

function seedLifetimeProfile () {
  const userStore = useUserStore();
  const existing = profile.subscriptions[0];
  if (!existing) {
    throw new Error('Expected the profile mock to include a subscription');
  }
  userStore.profile = {
    ...profile,
    subscriptions: [{
      ...existing,
      prices: {
        ...existing.prices,
        description: 'Lifetime',
        identifier: 'LIFE',
      },
      stripe_subscription_id: null,
    }],
  } as never;
}

describe('components/profile/ProfileContent', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    fetchMock.mockReset();
    toast.mockReset();
    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: null, error: null }),
    });
    seedFreeProfile();
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
    expect(wrapper.get('[data-testid="update-payment-method"]')
      .attributes('disabled'))
      .toBeDefined();
    expect(toast)
      .not
      .toHaveBeenCalled();
  });

  it('treats ofetch status (without statusCode) as a missing Stripe customer', async () => {
    fetchMock.mockRejectedValue({
      status: 404,
      statusMessage: 'No billing customer on file',
    });

    const wrapper = await mountSuspended(ProfileContent);
    const vm = wrapper.vm as any;

    await vm.fetchSubscriptionData();

    expect(vm.hasStripeBilling)
      .toBe(false);
    expect(toast)
      .not
      .toHaveBeenCalled();
  });

  it('skips Stripe billing for lifetime members and hides payment controls', async () => {
    fetchMock.mockRejectedValue({
      statusCode: 500,
      statusMessage: 'Error fetching stripe subscription',
    });

    const wrapper = await mountSuspended(ProfileContent);
    seedLifetimeProfile();
    await wrapper.vm.$nextTick();
    const vm = wrapper.vm as any;

    expect(wrapper.text())
      .toContain('Lifetime Subscription');

    vm.activeTab = 'subscription';
    await vm.fetchSubscriptionData();
    await Promise.resolve();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(fetchMock)
      .not
      .toHaveBeenCalled();
    expect(toast)
      .not
      .toHaveBeenCalled();
    expect(vm.displayedSubscriptionPlan)
      .toBe('Lifetime');
    expect(wrapper.text())
      .toContain('complimentary lifetime membership');
    expect(wrapper.get('[data-testid="manage-subscription"]')
      .text())
      .toContain('View Membership');
    expect(wrapper.find('[data-testid="update-payment-method"]')
      .exists())
      .toBe(false);
    expect(wrapper.text())
      .not
      .toContain('Payment Methods');
    expect(wrapper.text())
      .not
      .toContain('Next Billing Date');
  });

  it('clears password fields after a successful update', async () => {
    const updateUser = vi.fn()
      .mockResolvedValue({ data: {}, error: null });
    Object.assign(supabaseClient.current ?? {}, {
      auth: { updateUser },
    });

    const wrapper = await mountSuspended(ProfileContent);
    const vm = wrapper.vm as any;
    vm.newPassword = 'newpass123';
    vm.confirmPassword = 'newpass123';

    await vm.handleUpdatePassword();

    expect(updateUser)
      .toHaveBeenCalledWith({ password: 'newpass123' });
    expect(vm.newPassword)
      .toBe('');
    expect(vm.confirmPassword)
      .toBe('');
    expect(toast)
      .toHaveBeenCalled();
  });
});
