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
    cancel_at_period_end: false,
    ended_at: null,
    id: 'sub_123',
    items: {
      data: [
        {
          current_period_end: 1_700_086_400,
          current_period_start: 1_700_000_000,
          id: 'si_123',
          price: { id: 'price_annual' },
        },
      ],
    },
    status: 'active',
    ...overrides,
  } as Stripe.Subscription;
}

function createStripeMock () {
  return {
    customers: {
      create: vi.fn(),
      search: vi.fn(),
    },
    subscriptions: {
      create: vi.fn(),
      list: vi.fn(),
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
        limit: 1,
        query: `metadata['profile_id']:'user-1'`,
      });
  });

  it('reuses the database Stripe customer id without searching Stripe', async () => {
    const stripe = createStripeMock();

    await expect(ensureStripeCustomerId(stripe, {
      existingDbCustomerId: 'cus_db',
      name: 'Pat Packer',
      profileId: 'user-1',
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
      email: 'pat@example.com',
      name: 'Pat Packer',
      profileId: 'user-1',
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
      email: 'pat@example.com',
      name: 'Pat Packer',
      profileId: 'user-1',
    }))
      .resolves
      .toBe('cus_new');

    expect(stripe.customers.create)
      .toHaveBeenCalledWith({
        email: 'pat@example.com',
        metadata: { profile_id: 'user-1' },
        name: 'Pat Packer',
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
            current_period_end: 1_700_086_400,
            current_period_start: 1_700_000_000,
            id: 'si_123',
            price: { id: 'price_monthly' },
          }],
        },
      } as any) as any);

    await expect(ensureStripeSubscription(stripe, {
      customerId: 'cus_123',
      priceId: 'price_monthly',
      profileId: 'user-1',
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
      customerId: 'cus_123',
      priceId: 'price_annual',
      profileId: 'user-1',
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
        email: 'pat@example.com',
        name: 'Pat Packer',
        priceId: 'price_annual',
        profileId: 'user-1',
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
        hasSubscription: false,
        stripeCustomerId: null,
      })
      .mockResolvedValueOnce({
        hasSubscription: false,
        stripeCustomerId: null,
      })
      .mockResolvedValue({
        hasSubscription: false,
        stripeCustomerId: 'cus_retry',
      });

    const insertCustomerRow = vi.spyOn(persistStripeBilling, 'insertCustomerRow')
      .mockResolvedValue(undefined);
    const insertSubscriptionRow = vi.spyOn(persistStripeBilling, 'insertSubscriptionRow')
      .mockResolvedValue(undefined);

    await expect(createOrSyncPaidSubscription(
      stripe,
      asClient(createSupabaseMock()),
      {
        email: 'pat@example.com',
        name: 'Pat Packer',
        priceId: 'price_annual',
        profileId: 'user-1',
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
        priceId: 'price_annual',
        profileId: 'user-1',
        stripeSubscription: expect.objectContaining({ id: 'sub_retry' }),
      }));
  });
});
