import { describe, expect, it, vi } from 'vitest';
import { SubscriptionLevel } from '@/types';
import { completeOnboardingPlan } from '@/utils/onboarding';

describe('completeOnboardingPlan', () => {
  it('finishes Free without calling Stripe', async () => {
    const createPaidSubscription = vi.fn();
    const markOnboarded = vi.fn()
      .mockResolvedValue({ success: true });

    await completeOnboardingPlan({
      plan: SubscriptionLevel.FREE,
      createPaidSubscription,
      markOnboarded,
    });

    expect(createPaidSubscription)
      .not
      .toHaveBeenCalled();
    expect(markOnboarded)
      .toHaveBeenCalledTimes(1);
  });

  it('posts the selected paid plan before setting onboard_date', async () => {
    const createPaidSubscription = vi.fn()
      .mockResolvedValue({ ok: true });
    const markOnboarded = vi.fn()
      .mockResolvedValue({ success: true });

    await completeOnboardingPlan({
      plan: SubscriptionLevel.ANNUAL,
      createPaidSubscription,
      markOnboarded,
    });

    expect(createPaidSubscription)
      .toHaveBeenCalledWith(SubscriptionLevel.ANNUAL);
    expect(markOnboarded)
      .toHaveBeenCalledTimes(1);

    const stripeOrder = createPaidSubscription.mock.invocationCallOrder[0];
    const onboardOrder = markOnboarded.mock.invocationCallOrder[0];
    expect(stripeOrder)
      .toBeDefined();
    expect(onboardOrder)
      .toBeDefined();
    expect(stripeOrder!)
      .toBeLessThan(onboardOrder!);
  });

  it('does not set onboard_date when Stripe fails', async () => {
    const createPaidSubscription = vi.fn()
      .mockResolvedValue({ ok: false });
    const markOnboarded = vi.fn();

    await expect(completeOnboardingPlan({
      plan: SubscriptionLevel.MONTHLY,
      createPaidSubscription,
      markOnboarded,
    }))
      .rejects
      .toThrow('Unable to start your subscription.');

    expect(markOnboarded)
      .not
      .toHaveBeenCalled();
  });

  it('does not set onboard_date when Stripe throws', async () => {
    const createPaidSubscription = vi.fn()
      .mockRejectedValue(new Error('stripe down'));
    const markOnboarded = vi.fn();

    await expect(completeOnboardingPlan({
      plan: SubscriptionLevel.LIFE,
      createPaidSubscription,
      markOnboarded,
    }))
      .rejects
      .toThrow('stripe down');

    expect(markOnboarded)
      .not
      .toHaveBeenCalled();
  });

  it('requires a selected plan', async () => {
    const createPaidSubscription = vi.fn();
    const markOnboarded = vi.fn();

    await expect(completeOnboardingPlan({
      plan: null,
      createPaidSubscription,
      markOnboarded,
    }))
      .rejects
      .toThrow('Select a plan to continue.');

    expect(createPaidSubscription)
      .not
      .toHaveBeenCalled();
    expect(markOnboarded)
      .not
      .toHaveBeenCalled();
  });
});
