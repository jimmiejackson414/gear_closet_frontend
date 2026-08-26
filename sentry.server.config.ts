import * as Sentry from '@sentry/nuxt';
import { filterSentryEvent, resolveSentryEnabled } from './utils/sentryIgnore';

const dsn = (process.env.NUXT_SENTRY_DSN || process.env.NUXT_PUBLIC_SENTRY_DSN || '').trim();
const enabled = resolveSentryEnabled({
  dsn,
  enabledFlag: process.env.NUXT_PUBLIC_SENTRY_ENABLED,
  isProduction: process.env.NODE_ENV === 'production',
});

Sentry.init({
  beforeSend (event, hint) {
    return filterSentryEvent(event, hint.originalException);
  },
  dsn,
  enabled,
  environment: process.env.NUXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'production',
  sendDefaultPii: false,
  tracesSampleRate: 0,
});
