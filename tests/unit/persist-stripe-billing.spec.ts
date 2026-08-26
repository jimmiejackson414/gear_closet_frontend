import { describe, expect, it, vi } from 'vitest';
import {
  getExistingBilling,
  insertCustomerAndSubscription,
  insertCustomerRow,
  insertSubscriptionRow,
  updateSubscriptionRecord,
} from '@/server/utils/persistStripeBilling';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import type { Database } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

function asClient (mock: ReturnType<typeof createSupabaseMock>) {
  return mock as unknown as SupabaseClient<Database>;
}

function stripeSubscription (overrides: Partial<Stripe.Subscription> = {}): Stripe.Subscription {
  return {
    cancel_at_period_end: false,
    ended_at: null,
    id: 'sub_123',
    items: {
      data: [
        {
          current_period_end: 1_700_086_400,
          current_period_start: 1_700_000_000,
        },
      ],
    },
    ...overrides,
  } as Stripe.Subscription;
}

describe('getExistingBilling', () => {
  it('returns Stripe customer id and whether a subscription row exists', async () => {
    const from = vi.fn((table: string) => {
      if (table === 'customers') {
        return createThenableQuery({
          data: { stripe_customer_id: 'cus_existing' },
          error: null,
        });
      }
      return createThenableQuery({ data: { id: 'sub-row' }, error: null });
    });

    await expect(getExistingBilling(asClient(createSupabaseMock({ from })), 'user-1'))
      .resolves
      .toEqual({
        hasSubscription: true,
        stripeCustomerId: 'cus_existing',
      });
    expect(from)
      .toHaveBeenCalledWith('customers');
    expect(from)
      .toHaveBeenCalledWith('subscriptions');
  });

  it('treats missing rows as no billing yet', async () => {
    const from = vi.fn(() => createThenableQuery({ data: null, error: null }));

    await expect(getExistingBilling(asClient(createSupabaseMock({ from })), 'user-1'))
      .resolves
      .toEqual({
        hasSubscription: false,
        stripeCustomerId: null,
      });
  });
});

describe('insertSubscriptionRow', () => {
  it('inserts a subscription for the session profile only', async () => {
    const query = createThenableQuery({ data: [{ id: 's1' }], error: null });
    const from = vi.fn(() => query);

    await insertSubscriptionRow(asClient(createSupabaseMock({ from })), {
      priceId: 'price_123',
      profileId: 'user-1',
      stripeSubscription: stripeSubscription(),
    });

    expect(from)
      .toHaveBeenCalledWith('subscriptions');
    expect(query.insert)
      .toHaveBeenCalledWith(expect.objectContaining({
        price_id: 'price_123',
        profile_id: 'user-1',
        stripe_subscription_id: 'sub_123',
      }));
  });
});

describe('insertCustomerRow', () => {
  it('inserts a customer row for the session profile only', async () => {
    const query = createThenableQuery({ data: [{ id: 'c1' }], error: null });
    const from = vi.fn(() => query);

    await insertCustomerRow(asClient(createSupabaseMock({ from })), {
      profileId: 'user-1',
      stripeCustomerId: 'cus_123',
    });

    expect(from)
      .toHaveBeenCalledWith('customers');
    expect(query.insert)
      .toHaveBeenCalledWith({
        profile_id: 'user-1',
        stripe_customer_id: 'cus_123',
      });
  });
});

describe('insertCustomerAndSubscription', () => {
  it('inserts customers and subscriptions for the session profile only', async () => {
    const customerQuery = createThenableQuery({ data: [{ id: 'c1' }], error: null });
    const subscriptionQuery = createThenableQuery({ data: [{ id: 's1' }], error: null });
    const from = vi.fn((table: string) => (
      table === 'customers' ? customerQuery : subscriptionQuery
    ));

    await insertCustomerAndSubscription(asClient(createSupabaseMock({ from })), {
      priceId: 'price_123',
      profileId: 'user-1',
      stripeCustomerId: 'cus_123',
      stripeSubscription: stripeSubscription(),
    });

    expect(from)
      .toHaveBeenCalledWith('customers');
    expect(from)
      .toHaveBeenCalledWith('subscriptions');
    expect(customerQuery.insert)
      .toHaveBeenCalledWith({
        profile_id: 'user-1',
        stripe_customer_id: 'cus_123',
      });
    expect(subscriptionQuery.insert)
      .toHaveBeenCalledWith(expect.objectContaining({
        metadata: { profile_id: 'user-1' },
        price_id: 'price_123',
        profile_id: 'user-1',
        stripe_subscription_id: 'sub_123',
      }));
    expect(customerQuery.insert)
      .not
      .toHaveBeenCalledWith(expect.objectContaining({ profile_id: 'user-2' }));
    expect(subscriptionQuery.insert)
      .not
      .toHaveBeenCalledWith(expect.objectContaining({ profile_id: 'user-2' }));
  });

  it('throws when the customer insert is rejected', async () => {
    const supabase = createSupabaseMock({
      from: (table) => {
        if (table === 'customers') {
          return createThenableQuery({
            data: null,
            error: { message: 'rls' },
          });
        }
        return createThenableQuery({ data: [{ id: 's1' }], error: null });
      },
    });

    await expect(insertCustomerAndSubscription(asClient(supabase), {
      priceId: 'price_123',
      profileId: 'user-1',
      stripeCustomerId: 'cus_123',
      stripeSubscription: stripeSubscription(),
    }))
      .rejects
      .toMatchObject({ statusMessage: 'Error saving customer' });
  });
});

describe('updateSubscriptionRecord', () => {
  it('updates only the session user subscription row', async () => {
    const query = createThenableQuery({ data: [{ id: 's1' }], error: null });
    const from = vi.fn(() => query);

    await updateSubscriptionRecord(asClient(createSupabaseMock({ from })), {
      priceId: 'price_new',
      profileId: 'user-1',
      stripeSubscription: stripeSubscription({ id: 'sub_updated' }),
    });

    expect(from)
      .toHaveBeenCalledWith('subscriptions');
    expect(query.eq)
      .toHaveBeenCalledWith('profile_id', 'user-1');
    expect(query.update)
      .toHaveBeenCalledWith(expect.objectContaining({
        price_id: 'price_new',
        stripe_subscription_id: 'sub_updated',
      }));
    expect(query.eq)
      .not
      .toHaveBeenCalledWith('profile_id', 'user-2');
  });
});
