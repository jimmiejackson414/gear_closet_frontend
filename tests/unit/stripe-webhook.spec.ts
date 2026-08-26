import * as Sentry from '@sentry/nuxt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processStripeWebhookEvent } from '@/server/utils/processStripeWebhookEvent';
import { getSubscriptionItemPeriod } from '@/server/utils/stripe';
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

function stripeEvent<T extends string> (
  type: T,
  object: Record<string, unknown>,
): Stripe.Event {
  return {
    api_version: '2024-06-20',
    created: 1,
    data: { object },
    id: 'evt_test',
    livemode: false,
    object: 'event',
    pending_webhooks: 0,
    request: null,
    type,
  } as unknown as Stripe.Event;
}

vi.mock('@sentry/nuxt', () => ({
  captureException: vi.fn(),
}));

describe('getSubscriptionItemPeriod', () => {
  it('reads period from the first subscription item', () => {
    const period = getSubscriptionItemPeriod({
      items: {
        data: [
          {
            current_period_end: 200,
            current_period_start: 100,
          },
        ],
      },
    } as Stripe.Subscription);

    expect(period)
      .toEqual({ current_period_end: 200, current_period_start: 100 });
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
    vi.mocked(Sentry.captureException)
      .mockClear();
  });

  it('inserts a customer on customer.created', async () => {
    const log = vi.spyOn(console, 'log');
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
    expect(Sentry.captureException)
      .not
      .toHaveBeenCalled();
    expect(log)
      .not
      .toHaveBeenCalled();
    log.mockRestore();
  });

  it('inserts a subscription on customer.subscription.created', async () => {
    const from = vi.fn(() => createThenableQuery({
      data: [{ id: 1 }],
      error: null,
    }));
    const supabase = createSupabaseMock({ from });

    await processStripeWebhookEvent(
      stripeEvent('customer.subscription.created', {
        cancel_at: null,
        cancel_at_period_end: false,
        id: 'sub_123',
        items: {
          data: [
            {
              current_period_end: 1_700_086_400,
              current_period_start: 1_700_000_000,
              price: { id: 'price_123' },
              quantity: 1,
            },
          ],
        },
        metadata: { profile_id: 'profile-1' },
        status: 'active',
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
        active: true,
        description: 'Monthly plan',
        id: 'prod_1',
        images: ['https://example.com/img.png'],
        livemode: false,
        metadata: {},
        name: 'monthly',
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
        active: true,
        currency: 'usd',
        id: 'price_1',
        livemode: false,
        metadata: {},
        nickname: 'Monthly',
        product: 'prod_1',
        recurring: { interval: 'month', interval_count: 1 },
        type: 'recurring',
        unit_amount: 999,
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
        cancel_at: null,
        cancel_at_period_end: false,
        id: 'sub_free',
        items: {
          data: [
            {
              current_period_end: 1_700_086_400,
              current_period_start: 1_700_000_000,
              price: { id: 'price_free' },
              quantity: 1,
            },
          ],
        },
        metadata: { profile_id: 'profile-1' },
        status: 'active',
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
        cancel_at: null,
        cancel_at_period_end: false,
        id: 'sub_missing',
        items: {
          data: [
            {
              current_period_end: 1_700_086_400,
              current_period_start: 1_700_000_000,
              price: { id: 'price_paid' },
              quantity: 1,
            },
          ],
        },
        metadata: {},
        status: 'active',
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
        active: true,
        description: 'Monthly plan',
        id: 'prod_missing',
        images: [],
        livemode: false,
        metadata: {},
        name: 'monthly',
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
        active: true,
        currency: 'usd',
        id: 'price_missing',
        livemode: false,
        metadata: {},
        nickname: 'Monthly',
        product: 'prod_1',
        recurring: { interval: 'month', interval_count: 1 },
        type: 'recurring',
        unit_amount: 999,
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
    expect(Sentry.captureException)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          statusMessage: expect.stringMatching(/error occurred while creating a customer/),
        }),
        expect.objectContaining({
          extra: { stripeEventId: 'evt_test' },
          tags: { 'stripe.event': 'customer.created' },
        }),
      );
  });
});
