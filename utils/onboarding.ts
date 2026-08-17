import { SubscriptionLevel } from '@/types';
import { isPaidPlanIdentifier } from '@/utils/planLimits';

/**
 * Completes onboarding for a chosen plan. Paid plans must persist a Stripe
 * subscription before `onboard_date` is set so a failed charge cannot leave
 * the user marked onboarded with no billing row.
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
