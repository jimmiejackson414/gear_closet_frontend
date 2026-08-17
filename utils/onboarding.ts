import { SubscriptionLevel } from '@/types';
import { isPaidPlanIdentifier } from '@/utils/planLimits';

/**
 * Completes onboarding for a chosen plan.
 *
 * Card details are not collected during onboarding. Free (and optional Life
 * promo) finish here; Monthly/Annual billing is deferred to Profile, where
 * the existing Stripe Card Element attaches a payment method before subscribe.
 *
 * Paid plans that call `createPaidSubscription` today should only be used when
 * no card is required (e.g. Life promo). Monthly/Annual must not rely on this
 * path until Profile upgrade is wired (#65 / #71).
 */
export async function completeOnboardingPlan (input: {
  plan: SubscriptionLevel | null;
  createPaidSubscription: (plan: SubscriptionLevel) => Promise<{ ok: boolean }>;
  markOnboarded: () => Promise<{ success: boolean }>;
}): Promise<void> {
  if (!input.plan) {
    throw new Error('Select a plan to continue.');
  }

  if (isPaidPlanIdentifier(input.plan)) {
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
