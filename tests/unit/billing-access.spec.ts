import { describe, expect, it } from 'vitest';
import {
  resolveBillingCustomerAccess,
  resolveSubscriptionBillingAccess,
} from '@/server/utils/billingAccess';

describe('resolveBillingCustomerAccess', () => {
  it('returns 500 when the customer query fails', () => {
    expect(resolveBillingCustomerAccess(null, true))
      .toEqual({
        ok: false,
        statusCode: 500,
        statusMessage: 'Error fetching customer',
      });
  });

  it('returns 404 when no billing customer row exists', () => {
    expect(resolveBillingCustomerAccess(null, false))
      .toEqual({
        ok: false,
        statusCode: 404,
        statusMessage: 'No billing customer on file',
      });
  });

  it('returns the Stripe customer id when present', () => {
    expect(resolveBillingCustomerAccess({ stripe_customer_id: 'cus_123' }, false))
      .toEqual({
        ok: true,
        stripeCustomerId: 'cus_123',
      });
  });
});

describe('resolveSubscriptionBillingAccess', () => {
  it('returns 500 when the subscription query fails', () => {
    expect(resolveSubscriptionBillingAccess(null, true))
      .toEqual({
        ok: false,
        statusCode: 500,
        statusMessage: 'Error fetching subscription',
      });
  });

  it('returns 404 when no subscription row exists', () => {
    expect(resolveSubscriptionBillingAccess(null, false))
      .toEqual({
        ok: false,
        statusCode: 404,
        statusMessage: 'No subscription on file',
      });
  });

  it('returns the Stripe subscription id when present', () => {
    expect(resolveSubscriptionBillingAccess({ stripe_subscription_id: 'sub_123' }, false))
      .toEqual({
        ok: true,
        stripeSubscriptionId: 'sub_123',
      });
  });
});
