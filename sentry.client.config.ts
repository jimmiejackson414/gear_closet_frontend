import * as Sentry from '@sentry/nuxt';
import { filterSentryEvent, resolveSentryEnabled } from './utils/sentryIgnore';

const runtime = useRuntimeConfig();
const dsn = String(runtime.public.sentryDsn ?? '');
const enabled = resolveSentryEnabled({
  enabledFlag: runtime.public.sentryEnabled,
  dsn,
  isProduction: !import.meta.dev,
});

Sentry.init({
  dsn,
  enabled,
  environment: String(runtime.public.sentryEnvironment || (import.meta.dev ? 'development' : 'production')),
  sendDefaultPii: false,
  tracesSampleRate: 0,
  beforeSend (event, hint) {
    return filterSentryEvent(event, hint.originalException);
  },
});
