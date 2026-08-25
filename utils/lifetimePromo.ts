import { SubscriptionLevel } from '@/types';

/** Nuxt may expose this as a boolean or as the string from `.env`. */
export function isLifetimePromoEnabled (value: unknown): boolean {
  return value === true || value === 'true';
}

export function shouldGrantLifetimeOnOnboarding (
  plan: SubscriptionLevel,
  lifetimePromo: unknown,
): boolean {
  return plan === SubscriptionLevel.LIFE && isLifetimePromoEnabled(lifetimePromo);
}
