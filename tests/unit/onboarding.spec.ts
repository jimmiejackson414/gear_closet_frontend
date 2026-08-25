import { describe, expect, it, vi } from 'vitest';
import { SubscriptionLevel } from '@/types';
import {
  isLifetimePromoEnabled,
  shouldGrantLifetimeOnOnboarding,
} from '@/utils/lifetimePromo';
import {
  completeOnboardingPlan,
} from '@/utils/onboarding';

describe('isLifetimePromoEnabled', () => {
  it('treats boolean and string true as on', () => {
    expect(isLifetimePromoEnabled(true))
      .toBe(true);
    expect(isLifetimePromoEnabled('true'))
      .toBe(true);
  });

  it('treats everything else as off', () => {
    expect(isLifetimePromoEnabled(false))
      .toBe(false);
    expect(isLifetimePromoEnabled('false'))
      .toBe(false);
    expect(isLifetimePromoEnabled(''))
      .toBe(false);
    expect(isLifetimePromoEnabled(undefined))
      .toBe(false);
  });
});

describe('shouldGrantLifetimeOnOnboarding', () => {
  it('grants LIFE only when the promo flag is on', () => {
    expect(shouldGrantLifetimeOnOnboarding(SubscriptionLevel.LIFE, true))
      .toBe(true);
    expect(shouldGrantLifetimeOnOnboarding(SubscriptionLevel.LIFE, 'true'))
      .toBe(true);
    expect(shouldGrantLifetimeOnOnboarding(SubscriptionLevel.LIFE, false))
      .toBe(false);
    expect(shouldGrantLifetimeOnOnboarding(SubscriptionLevel.FREE, true))
      .toBe(false);
  });
});

describe('completeOnboardingPlan', () => {
  it('finishes Free without granting lifetime', async () => {
    const grantLifetime = vi.fn();
    const markOnboarded = vi.fn()
      .mockResolvedValue({ success: true });

    await completeOnboardingPlan({
      plan: SubscriptionLevel.FREE,
      lifetimePromo: true,
      grantLifetime,
      markOnboarded,
    });

    expect(grantLifetime)
      .not
      .toHaveBeenCalled();
    expect(markOnboarded)
      .toHaveBeenCalledTimes(1);
  });

  it('finishes Monthly/Annual without granting lifetime', async () => {
    const grantLifetime = vi.fn();
    const markOnboarded = vi.fn()
      .mockResolvedValue({ success: true });

    await completeOnboardingPlan({
      plan: SubscriptionLevel.ANNUAL,
      lifetimePromo: true,
      grantLifetime,
      markOnboarded,
    });

    expect(grantLifetime)
      .not
      .toHaveBeenCalled();
    expect(markOnboarded)
      .toHaveBeenCalledTimes(1);
  });

  it('grants LIFE before setting onboard_date when the promo is on', async () => {
    const grantLifetime = vi.fn()
      .mockResolvedValue({ ok: true });
    const markOnboarded = vi.fn()
      .mockResolvedValue({ success: true });

    await completeOnboardingPlan({
      plan: SubscriptionLevel.LIFE,
      lifetimePromo: true,
      grantLifetime,
      markOnboarded,
    });

    expect(grantLifetime)
      .toHaveBeenCalledTimes(1);
    expect(markOnboarded)
      .toHaveBeenCalledTimes(1);

    const grantOrder = grantLifetime.mock.invocationCallOrder[0];
    const onboardOrder = markOnboarded.mock.invocationCallOrder[0];
    expect(grantOrder!)
      .toBeLessThan(onboardOrder!);
  });

  it('does not grant LIFE when the promo is off', async () => {
    const grantLifetime = vi.fn();
    const markOnboarded = vi.fn()
      .mockResolvedValue({ success: true });

    await completeOnboardingPlan({
      plan: SubscriptionLevel.LIFE,
      lifetimePromo: false,
      grantLifetime,
      markOnboarded,
    });

    expect(grantLifetime)
      .not
      .toHaveBeenCalled();
    expect(markOnboarded)
      .toHaveBeenCalledTimes(1);
  });

  it('does not set onboard_date when the lifetime grant fails', async () => {
    const grantLifetime = vi.fn()
      .mockResolvedValue({ ok: false });
    const markOnboarded = vi.fn();

    await expect(completeOnboardingPlan({
      plan: SubscriptionLevel.LIFE,
      lifetimePromo: true,
      grantLifetime,
      markOnboarded,
    }))
      .rejects
      .toThrow('Unable to start your subscription.');

    expect(markOnboarded)
      .not
      .toHaveBeenCalled();
  });

  it('requires a selected plan', async () => {
    const grantLifetime = vi.fn();
    const markOnboarded = vi.fn();

    await expect(completeOnboardingPlan({
      plan: null,
      grantLifetime,
      markOnboarded,
    }))
      .rejects
      .toThrow('Select a plan to continue.');

    expect(grantLifetime)
      .not
      .toHaveBeenCalled();
    expect(markOnboarded)
      .not
      .toHaveBeenCalled();
  });
});
