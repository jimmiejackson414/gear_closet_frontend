import * as Sentry from '@sentry/nuxt';
import { filterSentryEvent, resolveSentryEnabled } from './utils/sentryIgnore';

const dsn = (process.env.NUXT_SENTRY_DSN || process.env.NUXT_PUBLIC_SENTRY_DSN || '').trim();
const enabled = resolveSentryEnabled({
  enabledFlag: process.env.NUXT_PUBLIC_SENTRY_ENABLED,
  dsn,
  isProduction: process.env.NODE_ENV === 'production',
});

Sentry.init({
  dsn,
  enabled,
  environment: process.env.NUXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'production',
  sendDefaultPii: false,
  tracesSampleRate: 0,
  beforeSend (event, hint) {
    return filterSentryEvent(event, hint.originalException);
  },
});
