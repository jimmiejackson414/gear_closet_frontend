import type { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processStripeWebhookEvent } from '@/server/utils/processStripeWebhookEvent';
import { getSubscriptionItemPeriod } from '@/server/utils/stripe';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import type { Database } from '@/types';

function asClient (mock: ReturnType<typeof createSupabaseMock>) {
  return mock as unknown as SupabaseClient<Database>;
}

function stripeEvent<T extends string> (
  type: T,
  object: Record<string, unknown>,
): Stripe.Event {
  return {
    id: 'evt_test',
    object: 'event',
    api_version: '2024-06-20',
    created: 1,
    livemode: false,
    pending_webhooks: 0,
    request: null,
    type,
    data: { object },
  } as unknown as Stripe.Event;
}

describe('getSubscriptionItemPeriod', () => {
  it('reads period from the first subscription item', () => {
    const period = getSubscriptionItemPeriod({
      items: {
        data: [
          {
            current_period_start: 100,
            current_period_end: 200,
          },
        ],
      },
    } as Stripe.Subscription);

    expect(period)
      .toEqual({ current_period_start: 100, current_period_end: 200 });
  });

  it('throws when subscription has no items', () => {
    expect(() => getSubscriptionItemPeriod({
      items: { data: [] },
    } as unknown as Stripe.Subscription))
      .toThrow();
  });
});

describe('processStripeWebhookEvent', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log')
      .mockImplementation(() => undefined);
    vi.spyOn(console, 'error')
      .mockImplementation(() => undefined);
  });

  it('inserts a customer on customer.created', async () => {
    const from = vi.fn(() => createThenableQuery({
      data: [{ id: 1 }],
      error: null,
    }));
    const supabase = createSupabaseMock({ from });

    await processStripeWebhookEvent(
      stripeEvent('customer.created', {
        id: 'cus_123',
        metadata: { profile_id: 'profile-1' },
      }),
      asClient(supabase),
    );

    expect(from)
      .toHaveBeenCalledWith('customers');
  });

  it('inserts a subscription on customer.subscription.created', async () => {
    const from = vi.fn(() => createThenableQuery({
      data: [{ id: 1 }],
      error: null,
    }));
    const supabase = createSupabaseMock({ from });

    await processStripeWebhookEvent(
      stripeEvent('customer.subscription.created', {
        id: 'sub_123',
        status: 'active',
        metadata: { profile_id: 'profile-1' },
        cancel_at_period_end: false,
        cancel_at: null,
        items: {
          data: [
            {
              price: { id: 'price_123' },
              quantity: 1,
              current_period_start: 1_700_000_000,
              current_period_end: 1_700_086_400,
            },
          ],
        },
      }),
      asClient(supabase),
    );

    expect(from)
      .toHaveBeenCalledWith('subscriptions');
  });

  it('inserts a product on product.created', async () => {
    const from = vi.fn(() => createThenableQuery({
      data: [{ id: 'prod_1' }],
      error: null,
    }));
    const supabase = createSupabaseMock({ from });

    await processStripeWebhookEvent(
      stripeEvent('product.created', {
        id: 'prod_1',
        active: true,
        name: 'monthly',
        description: 'Monthly plan',
        images: ['https://example.com/img.png'],
        metadata: {},
        livemode: false,
      }),
      asClient(supabase),
    );

    expect(from)
      .toHaveBeenCalledWith('products');
  });

  it('inserts a price on price.created', async () => {
    const from = vi.fn(() => createThenableQuery({
      data: [{ id: 'price_1' }],
      error: null,
    }));
    const supabase = createSupabaseMock({ from });

    await processStripeWebhookEvent(
      stripeEvent('price.created', {
        id: 'price_1',
        product: 'prod_1',
        active: true,
        nickname: 'Monthly',
        unit_amount: 999,
        currency: 'usd',
        type: 'recurring',
        recurring: { interval: 'month', interval_count: 1 },
        metadata: {},
        livemode: false,
      }),
      asClient(supabase),
    );

    expect(from)
      .toHaveBeenCalledWith('prices');
  });

  it('no-ops for unexpected event types', async () => {
    const from = vi.fn();
    const supabase = createSupabaseMock({ from });

    await processStripeWebhookEvent(
      stripeEvent('invoice.paid' as Stripe.Event.Type, { id: 'in_1' }),
      asClient(supabase),
    );

    expect(from)
      .not
      .toHaveBeenCalled();
  });

  it('marks Free selection needed when subscription updates to a Free price', async () => {
    const tables: string[] = [];
    const supabase = createSupabaseMock({
      from: (table) => {
        tables.push(table);
        if (table === 'subscriptions') {
          return createThenableQuery({ data: [{ id: 1 }], error: null });
        }
        if (table === 'prices') {
          return createThenableQuery({ data: { identifier: 'FREE' }, error: null });
        }
        if (table === 'packs') {
          return createThenableQuery({
            data: [{ id: 1, locked_at: null }, { id: 2, locked_at: null }],
            error: null,
          });
        }
        if (table === 'trips') {
          return createThenableQuery({ data: [{ id: 1, locked_at: null }], error: null });
        }
        if (table === 'profiles') {
          return createThenableQuery({ data: [{ id: 'profile-1' }], error: null });
        }
        return createThenableQuery({ data: null, error: null });
      },
    });

    await processStripeWebhookEvent(
      stripeEvent('customer.subscription.updated', {
        id: 'sub_free',
        status: 'active',
        metadata: { profile_id: 'profile-1' },
        cancel_at_period_end: false,
        cancel_at: null,
        items: {
          data: [
            {
              price: { id: 'price_free' },
              quantity: 1,
              current_period_start: 1_700_000_000,
              current_period_end: 1_700_086_400,
            },
          ],
        },
      }),
      asClient(supabase),
    );

    expect(tables)
      .toContain('profiles');
    expect(tables)
      .toContain('packs');
  });

  it('soft-deletes a customer on customer.deleted by stripe_customer_id', async () => {
    const query = createThenableQuery({ data: null, error: null });
    const from = vi.fn(() => query);
    const supabase = createSupabaseMock({ from });

    await processStripeWebhookEvent(
      stripeEvent('customer.deleted', {
        id: 'cus_123',
        metadata: { profil_id: 'legacy-typo' },
      }),
      asClient(supabase),
    );

    expect(from)
      .toHaveBeenCalledWith('customers');
    expect(query.eq)
      .toHaveBeenCalledWith('stripe_customer_id', 'cus_123');
    expect(query.match)
      .not
      .toHaveBeenCalled();
  });

  it('treats a missing customer row as success on customer.deleted replay', async () => {
    const supabase = createSupabaseMock({
      from: () => createThenableQuery({ data: [], error: null }),
    });

    await expect(processStripeWebhookEvent(
      stripeEvent('customer.deleted', {
        id: 'cus_already_gone',
        metadata: {},
      }),
      asClient(supabase),
    ))
      .resolves
      .toBeUndefined();
  });

  it('still throws when customer.deleted hits a database error', async () => {
    const supabase = createSupabaseMock({
      from: () => createThenableQuery({
        data: null,
        error: { message: 'db fail' },
      }),
    });

    await expect(processStripeWebhookEvent(
      stripeEvent('customer.deleted', {
        id: 'cus_err',
        metadata: { profile_id: 'profile-1' },
      }),
      asClient(supabase),
    ))
      .rejects
      .toMatchObject({
        statusMessage: expect.stringMatching(/error occurred while deleting a customer|catch error occurred while deleting a customer/),
      });
  });

  it('does not 500 when subscription.updated matches zero rows', async () => {
    const query = createThenableQuery({ data: [], error: null });
    const from = vi.fn(() => query);

    await expect(processStripeWebhookEvent(
      stripeEvent('customer.subscription.updated', {
        id: 'sub_missing',
        status: 'active',
        metadata: {},
        cancel_at_period_end: false,
        cancel_at: null,
        items: {
          data: [
            {
              price: { id: 'price_paid' },
              quantity: 1,
              current_period_start: 1_700_000_000,
              current_period_end: 1_700_086_400,
            },
          ],
        },
      }),
      asClient(createSupabaseMock({ from })),
    ))
      .resolves
      .toBeUndefined();

    expect(from)
      .toHaveBeenCalledWith('subscriptions');
    expect(query.eq)
      .toHaveBeenCalledWith('stripe_subscription_id', 'sub_missing');
  });

  it('does not 500 when product.updated matches zero rows', async () => {
    const supabase = createSupabaseMock({
      from: () => createThenableQuery({ data: [], error: null }),
    });

    await expect(processStripeWebhookEvent(
      stripeEvent('product.updated', {
        id: 'prod_missing',
        active: true,
        name: 'monthly',
        description: 'Monthly plan',
        images: [],
        metadata: {},
        livemode: false,
      }),
      asClient(supabase),
    ))
      .resolves
      .toBeUndefined();
  });

  it('does not 500 when price.updated matches zero rows', async () => {
    const supabase = createSupabaseMock({
      from: () => createThenableQuery({ data: [], error: null }),
    });

    await expect(processStripeWebhookEvent(
      stripeEvent('price.updated', {
        id: 'price_missing',
        product: 'prod_1',
        active: true,
        nickname: 'Monthly',
        unit_amount: 999,
        currency: 'usd',
        type: 'recurring',
        recurring: { interval: 'month', interval_count: 1 },
        metadata: {},
        livemode: false,
      }),
      asClient(supabase),
    ))
      .resolves
      .toBeUndefined();
  });

  it('rethrows when customer insert fails', async () => {
    const supabase = createSupabaseMock({
      from: () => createThenableQuery({
        data: null,
        error: { message: 'db fail' },
      }),
    });

    await expect(processStripeWebhookEvent(
      stripeEvent('customer.created', {
        id: 'cus_err',
        metadata: { profile_id: 'profile-1' },
      }),
      asClient(supabase),
    ))
      .rejects
      .toMatchObject({
        statusMessage: expect.stringMatching(/error occurred while creating a customer|catch error occurred while creating a customer/),
      });
  });
});
