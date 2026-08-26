import * as Sentry from '@sentry/nuxt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  reportServerError,
  throwPublicError,
} from '@/server/utils/reportServerError';
import { verifyStripeWebhookSignature } from '@/server/utils/stripeWebhookHandler';
import { wasSentryReported } from '@/utils/sentryIgnore';

vi.mock('@sentry/nuxt', () => ({
  captureException: vi.fn(),
}));

describe('reportServerError', () => {
  beforeEach(() => {
    vi.mocked(Sentry.captureException)
      .mockClear();
  });

  it('captures an exception with tags once', () => {
    const error = new Error('db exploded');

    reportServerError(error, { tags: { route: '/api/profile' } });
    reportServerError(error, { tags: { route: '/api/profile' } });

    expect(Sentry.captureException)
      .toHaveBeenCalledTimes(1);
    expect(Sentry.captureException)
      .toHaveBeenCalledWith(error, {
        extra: undefined,
        tags: { route: '/api/profile' },
      });
  });

  it('throws a generic public error while reporting the cause', () => {
    const cause = new Error('Discourse timed out');

    expect(() => throwPublicError(cause, {
      statusCode: 500,
      statusMessage: 'An error occurred while fetching posts',
      tags: { route: '/api/forumPosts' },
    }))
      .toThrow(expect.objectContaining({
        cause,
        statusCode: 500,
        statusMessage: 'An error occurred while fetching posts',
      }));

    expect(Sentry.captureException)
      .toHaveBeenCalledWith(cause, {
        extra: undefined,
        tags: { route: '/api/forumPosts' },
      });
    expect(Sentry.captureException)
      .toHaveBeenCalledTimes(1);
  });
});

describe('verifyStripeWebhookSignature', () => {
  beforeEach(() => {
    vi.mocked(Sentry.captureException)
      .mockClear();
  });

  it('returns the verified event', () => {
    const event = { id: 'evt_1', type: 'customer.created' };
    const constructEvent = vi.fn()
      .mockReturnValue(event);

    expect(verifyStripeWebhookSignature(
      { webhooks: { constructEvent } },
      '{}',
      'sig',
      'whsec_test',
    ))
      .toBe(event);
    expect(Sentry.captureException)
      .not
      .toHaveBeenCalled();
  });

  it('reports constructEvent failures and throws a generic 400', () => {
    const cause = new Error('No signatures found matching the expected signature');
    const constructEvent = vi.fn()
      .mockImplementation(() => {
        throw cause;
      });

    expect(() => verifyStripeWebhookSignature(
      { webhooks: { constructEvent } },
      '{}',
      'bad',
      'whsec_test',
    ))
      .toThrow(expect.objectContaining({
        statusCode: 400,
        statusMessage: 'Invalid Stripe webhook signature',
      }));

    expect(Sentry.captureException)
      .toHaveBeenCalledWith(cause, {
        extra: undefined,
        tags: { 'stripe.webhook': 'signature' },
      });
    expect(wasSentryReported(cause))
      .toBe(true);
  });
});
