import * as Sentry from '@sentry/nuxt';
import { filterSentryEvent, resolveSentryEnabled } from './utils/sentryIgnore';

const runtime = useRuntimeConfig();
const dsn = String(runtime.public.sentryDsn ?? '');
const enabled = resolveSentryEnabled({
  dsn,
  enabledFlag: runtime.public.sentryEnabled,
  isProduction: !import.meta.dev,
});

Sentry.init({
  beforeSend (event, hint) {
    return filterSentryEvent(event, hint.originalException);
  },
  dsn,
  enabled,
  environment: String(runtime.public.sentryEnvironment || (import.meta.dev ? 'development' : 'production')),
  sendDefaultPii: false,
  tracesSampleRate: 0,
});
