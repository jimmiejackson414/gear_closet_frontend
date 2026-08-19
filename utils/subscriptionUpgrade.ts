import { SubscriptionLevel } from '@/types';
import { isPaidPlanIdentifier } from '@/utils/planLimits';

/** Free user choosing a paid plan with no Stripe subscription row yet. */
export function isFirstPaidUpgrade (
  plan: SubscriptionLevel | undefined,
  hasExistingSubscription: boolean,
): boolean {
  if (!plan || !isPaidPlanIdentifier(plan)) return false;
  return !hasExistingSubscription;
}

export function subscriptionChangeMethod (
  plan: SubscriptionLevel | undefined,
  hasExistingSubscription: boolean,
): 'POST' | 'PUT' {
  return isFirstPaidUpgrade(plan, hasExistingSubscription) ? 'POST' : 'PUT';
}
