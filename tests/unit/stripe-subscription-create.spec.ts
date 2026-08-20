import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as persistStripeBilling from '@/server/utils/persistStripeBilling';
import {
  createOrSyncPaidSubscription,
  customerIdempotencyKey,
  ensureStripeCustomerId,
  ensureStripeSubscription,
  findReusableStripeSubscription,
  findStripeCustomerIdForProfile,
  subscriptionIdempotencyKey,
} from '@/server/utils/stripeSubscriptionCreate';
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
    id: 'sub_123',
    status: 'active',
    ended_at: null,
    cancel_at_period_end: false,
    items: {
      data: [
        {
          id: 'si_123',
          price: { id: 'price_annual' },
          current_period_start: 1_700_000_000,
          current_period_end: 1_700_086_400,
        },
      ],
    },
    ...overrides,
  } as Stripe.Subscription;
}

function createStripeMock () {
  return {
    customers: {
      search: vi.fn(),
      create: vi.fn(),
    },
    subscriptions: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  } as unknown as Stripe;
}

describe('stripeSubscriptionCreate helpers', () => {
  it('builds stable idempotency keys per profile', () => {
    expect(customerIdempotencyKey('user-1'))
      .toBe('gc-customer-user-1');
    expect(subscriptionIdempotencyKey('user-1'))
      .toBe('gc-subscription-user-1');
  });

  it('finds an existing Stripe customer by profile metadata', async () => {
    const stripe = createStripeMock();
    vi.mocked(stripe.customers.search)
      .mockResolvedValue({ data: [{ id: 'cus_existing' }] } as any);

    await expect(findStripeCustomerIdForProfile(stripe, 'user-1'))
      .resolves
      .toBe('cus_existing');
    expect(stripe.customers.search)
      .toHaveBeenCalledWith({
        query: `metadata['profile_id']:'user-1'`,
        limit: 1,
      });
  });

  it('reuses the database Stripe customer id without searching Stripe', async () => {
    const stripe = createStripeMock();

    await expect(ensureStripeCustomerId(stripe, {
      profileId: 'user-1',
      name: 'Pat Packer',
      existingDbCustomerId: 'cus_db',
    }))
      .resolves
      .toBe('cus_db');

    expect(stripe.customers.search)
      .not
      .toHaveBeenCalled();
    expect(stripe.customers.create)
      .not
      .toHaveBeenCalled();
  });

  it('reuses a Stripe customer found by metadata before creating a new one', async () => {
    const stripe = createStripeMock();
    vi.mocked(stripe.customers.search)
      .mockResolvedValue({ data: [{ id: 'cus_found' }] } as any);

    await expect(ensureStripeCustomerId(stripe, {
      profileId: 'user-1',
      email: 'pat@example.com',
      name: 'Pat Packer',
    }))
      .resolves
      .toBe('cus_found');

    expect(stripe.customers.create)
      .not
      .toHaveBeenCalled();
  });

  it('creates a Stripe customer with an idempotency key when none exists', async () => {
    const stripe = createStripeMock();
    vi.mocked(stripe.customers.search)
      .mockResolvedValue({ data: [] } as any);
    vi.mocked(stripe.customers.create)
      .mockResolvedValue({ id: 'cus_new' } as any);

    await expect(ensureStripeCustomerId(stripe, {
      profileId: 'user-1',
      email: 'pat@example.com',
      name: 'Pat Packer',
    }))
      .resolves
      .toBe('cus_new');

    expect(stripe.customers.create)
      .toHaveBeenCalledWith({
        email: 'pat@example.com',
        name: 'Pat Packer',
        metadata: { profile_id: 'user-1' },
      }, {
        idempotencyKey: 'gc-customer-user-1',
      });
  });

  it('updates an existing Stripe subscription price instead of creating a duplicate', async () => {
    const stripe = createStripeMock();
    vi.mocked(stripe.subscriptions.list)
      .mockResolvedValue({
        data: [stripeSubscription({ id: 'sub_existing' })],
      } as any);
    vi.mocked(stripe.subscriptions.update)
      .mockResolvedValue(stripeSubscription({
        id: 'sub_existing',
        items: {
          data: [{
            id: 'si_123',
            price: { id: 'price_monthly' },
            current_period_start: 1_700_000_000,
            current_period_end: 1_700_086_400,
          }],
        },
      } as any));

    await expect(ensureStripeSubscription(stripe, {
      profileId: 'user-1',
      customerId: 'cus_123',
      priceId: 'price_monthly',
    }))
      .resolves
      .toMatchObject({ id: 'sub_existing' });

    expect(stripe.subscriptions.create)
      .not
      .toHaveBeenCalled();
    expect(stripe.subscriptions.update)
      .toHaveBeenCalledWith('sub_existing', {
        items: [{ id: 'si_123', price: 'price_monthly' }],
      });
  });

  it('creates a subscription with an idempotency key when none is reusable', async () => {
    const stripe = createStripeMock();
    vi.mocked(stripe.subscriptions.list)
      .mockResolvedValue({ data: [] } as any);
    vi.mocked(stripe.subscriptions.create)
      .mockResolvedValue(stripeSubscription() as any);

    await ensureStripeSubscription(stripe, {
      profileId: 'user-1',
      customerId: 'cus_123',
      priceId: 'price_annual',
    });

    expect(stripe.subscriptions.create)
      .toHaveBeenCalledWith({
        customer: 'cus_123',
        items: [{ price: 'price_annual' }],
        metadata: { profile_id: 'user-1' },
      }, {
        idempotencyKey: 'gc-subscription-user-1',
      });
  });

  it('ignores canceled subscriptions when searching for a reusable subscription', async () => {
    const stripe = createStripeMock();
    vi.mocked(stripe.subscriptions.list)
      .mockResolvedValue({
        data: [stripeSubscription({ id: 'sub_old', status: 'canceled' })],
      } as any);
    vi.mocked(stripe.subscriptions.create)
      .mockResolvedValue(stripeSubscription({ id: 'sub_new' }) as any);

    await expect(findReusableStripeSubscription(stripe, 'cus_123'))
      .resolves
      .toBeNull();
  });
});

describe('createOrSyncPaidSubscription', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns early when the database already has a subscription row', async () => {
    const stripe = createStripeMock();
    const from = vi.fn((table: string) => {
      if (table === 'customers') {
        return createThenableQuery({
          data: { stripe_customer_id: 'cus_db' },
          error: null,
        });
      }
      return createThenableQuery({ data: { id: 'sub-row' }, error: null });
    });

    await expect(createOrSyncPaidSubscription(
      stripe,
      asClient(createSupabaseMock({ from })),
      {
        profileId: 'user-1',
        email: 'pat@example.com',
        name: 'Pat Packer',
        priceId: 'price_annual',
      },
    ))
      .resolves
      .toEqual({ ok: true });

    expect(stripe.customers.create)
      .not
      .toHaveBeenCalled();
    expect(stripe.subscriptions.create)
      .not
      .toHaveBeenCalled();
  });

  it('syncs a Stripe customer/subscription to the database after a partial failure', async () => {
    const stripe = createStripeMock();
    vi.mocked(stripe.customers.search)
      .mockResolvedValue({ data: [{ id: 'cus_retry' }] } as any);
    vi.mocked(stripe.subscriptions.list)
      .mockResolvedValue({ data: [stripeSubscription({ id: 'sub_retry' })] } as any);

    vi.spyOn(persistStripeBilling, 'getExistingBilling')
      .mockResolvedValueOnce({
        stripeCustomerId: null,
        hasSubscription: false,
      })
      .mockResolvedValueOnce({
        stripeCustomerId: null,
        hasSubscription: false,
      })
      .mockResolvedValue({
        stripeCustomerId: 'cus_retry',
        hasSubscription: false,
      });

    const insertCustomerRow = vi.spyOn(persistStripeBilling, 'insertCustomerRow')
      .mockResolvedValue(undefined);
    const insertSubscriptionRow = vi.spyOn(persistStripeBilling, 'insertSubscriptionRow')
      .mockResolvedValue(undefined);

    await expect(createOrSyncPaidSubscription(
      stripe,
      asClient(createSupabaseMock()),
      {
        profileId: 'user-1',
        email: 'pat@example.com',
        name: 'Pat Packer',
        priceId: 'price_annual',
      },
    ))
      .resolves
      .toEqual({ ok: true });

    expect(stripe.customers.create)
      .not
      .toHaveBeenCalled();
    expect(stripe.subscriptions.create)
      .not
      .toHaveBeenCalled();
    expect(insertCustomerRow)
      .toHaveBeenCalledWith(expect.anything(), {
        profileId: 'user-1',
        stripeCustomerId: 'cus_retry',
      });
    expect(insertSubscriptionRow)
      .toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        profileId: 'user-1',
        stripeSubscription: expect.objectContaining({ id: 'sub_retry' }),
        priceId: 'price_annual',
      }));
  });
});
