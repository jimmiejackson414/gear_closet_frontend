import * as Sentry from '@sentry/nuxt';
import { markSentryReported, wasSentryReported } from '@/utils/sentryIgnore';

export const reportServerError = (
  error: unknown,
  context?: {
    extra?: Record<string, unknown>
    tags?: Record<string, string>
  },
) => {
  if (error == null || wasSentryReported(error)) return;
  markSentryReported(error);
  Sentry.captureException(error, {
    extra: context?.extra,
    tags: context?.tags,
  });
};

export const throwPublicError = (
  error: unknown,
  input: {
    extra?: Record<string, unknown>
    statusCode: number
    statusMessage: string
    tags?: Record<string, string>
  },
): never => {
  reportServerError(error, {
    extra: input.extra,
    tags: input.tags,
  });
  const wrapped = createError({
    statusCode: input.statusCode,
    statusMessage: input.statusMessage,
    cause: error,
  });
  markSentryReported(wrapped);
  throw wrapped;
};
