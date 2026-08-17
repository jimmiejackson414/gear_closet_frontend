import { SubscriptionLevel } from '@/types';

/**
 * Only Life promo subscriptions are created during onboarding. Monthly and
 * Annual billing is deferred to Profile, where the user adds a card first.
 */
export function requiresOnboardingStripeSubscription (plan: SubscriptionLevel): boolean {
  return plan === SubscriptionLevel.LIFE;
}

/**
 * Completes onboarding for a chosen plan.
 *
 * Free users finish with no Stripe rows. Life promo may POST a subscription
 * without collecting card details. Monthly/Annual selections complete as Free;
 * paid billing happens later from Profile.
 */
export async function completeOnboardingPlan (input: {
  plan: SubscriptionLevel | null;
  createPaidSubscription: (plan: SubscriptionLevel) => Promise<{ ok: boolean }>;
  markOnboarded: () => Promise<{ success: boolean }>;
}): Promise<void> {
  if (!input.plan) {
    throw new Error('Select a plan to continue.');
  }

  if (requiresOnboardingStripeSubscription(input.plan)) {
    const response = await input.createPaidSubscription(input.plan);
    if (!response.ok) {
      throw new Error('Unable to start your subscription.');
    }
  }

  const { success } = await input.markOnboarded();
  if (!success) {
    throw new Error('Unable to finish onboarding.');
  }
}
