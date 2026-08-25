import { SubscriptionLevel } from '@/types';
import { shouldGrantLifetimeOnOnboarding } from '@/utils/lifetimePromo';
import type { ExtendedUser } from '@/types/profile';

/**
 * Completes onboarding for a chosen plan by setting `onboard_date`.
 *
 * Card details are not collected during onboarding. When the lifetime promo
 * flag is on, choosing LIFE writes a DB subscription row (no Stripe).
 * Monthly/Annual checkout stays on Profile.
 */
export async function completeOnboardingPlan (input: {
  plan: SubscriptionLevel | null;
  lifetimePromo?: unknown;
  grantLifetime: () => Promise<{ ok: boolean }>;
  markOnboarded: () => Promise<{ success: boolean }>;
}): Promise<void> {
  if (!input.plan) {
    throw new Error('Select a plan to continue.');
  }

  if (shouldGrantLifetimeOnOnboarding(input.plan, input.lifetimePromo)) {
    const response = await input.grantLifetime();
    if (!response.ok) {
      throw new Error('Unable to start your subscription.');
    }
  }

  const { success } = await input.markOnboarded();
  if (!success) {
    throw new Error('Unable to finish onboarding.');
  }
}

export const completedOnboarding = (user: ExtendedUser | null | undefined, page: string) => {
  if (!user || !user.onboarding_steps) return false;
  return user.onboarding_steps.some(step => step?.page === page);
};
