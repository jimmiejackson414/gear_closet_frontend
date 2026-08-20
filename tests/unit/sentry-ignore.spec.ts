import { describe, expect, it, vi } from 'vitest';
import {
  filterSentryEvent,
  markSentryReported,
  reportErrorOnce,
  resolveSentryEnabled,
  sentryStatusCode,
  shouldIgnoreSentryError,
  wasSentryReported,
} from '@/utils/sentryIgnore';

describe('sentry helpers', () => {
  it('keeps local reporting off unless explicitly enabled', () => {
    expect(resolveSentryEnabled({
      dsn: 'https://example@o1.ingest.sentry.io/1',
      isProduction: false,
    }))
      .toBe(false);
    expect(resolveSentryEnabled({
      dsn: 'https://example@o1.ingest.sentry.io/1',
      enabledFlag: 'true',
      isProduction: false,
    }))
      .toBe(true);
    expect(resolveSentryEnabled({
      dsn: 'https://example@o1.ingest.sentry.io/1',
      isProduction: true,
    }))
      .toBe(true);
    expect(resolveSentryEnabled({
      dsn: 'https://example@o1.ingest.sentry.io/1',
      enabledFlag: 'false',
      isProduction: true,
    }))
      .toBe(false);
    expect(resolveSentryEnabled({
      dsn: '',
      isProduction: true,
    }))
      .toBe(false);
    expect(resolveSentryEnabled({
      dsn: 'https://example@o1.ingest.sentry.io/1',
      enabledFlag: false,
      isProduction: true,
    }))
      .toBe(false);
    expect(resolveSentryEnabled({
      dsn: 'https://example@o1.ingest.sentry.io/1',
      enabledFlag: true,
      isProduction: false,
    }))
      .toBe(true);
  });

  it('ignores 401, 404, and redirect noise', () => {
    expect(shouldIgnoreSentryError({ statusCode: 401 }))
      .toBe(true);
    expect(shouldIgnoreSentryError({ status: 404 }))
      .toBe(true);
    expect(shouldIgnoreSentryError({ statusCode: 302 }))
      .toBe(true);
    expect(shouldIgnoreSentryError(new Error('Redirected')))
      .toBe(true);
    expect(shouldIgnoreSentryError({ cause: { statusCode: 401 } }))
      .toBe(true);
    expect(sentryStatusCode({ statusCode: 500 }))
      .toBe(500);
    expect(shouldIgnoreSentryError(new Error('Database exploded')))
      .toBe(false);
  });

  it('reports an error object only once', () => {
    const error = new Error('once');
    const capture = vi.fn();

    reportErrorOnce(error, capture);
    reportErrorOnce(error, capture);

    expect(capture)
      .toHaveBeenCalledTimes(1);
    expect(wasSentryReported(error))
      .toBe(true);
    markSentryReported(error);
    expect(shouldIgnoreSentryError({ statusCode: 401 }))
      .toBe(true);
  });

  it('drops ignored or already-reported exceptions from beforeSend', () => {
    const event = { event_id: '1' };
    expect(filterSentryEvent(event, undefined))
      .toEqual(event);
    expect(filterSentryEvent(event, { statusCode: 401 }))
      .toBeNull();

    const error = new Error('boom');
    expect(filterSentryEvent(event, error))
      .toEqual(event);
    expect(filterSentryEvent(event, error))
      .toBeNull();
  });
});
