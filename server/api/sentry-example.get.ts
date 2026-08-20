/**
 * @api {get} /sentry-example Probe Sentry server capture
 * @apiName SentryExample
 * @summary Throws a test error when `?key=` matches NUXT_SENTRY_PROBE_KEY. 404 otherwise.
 */
export default defineEventHandler((event) => {
  const expected = String(useRuntimeConfig(event).sentryProbeKey ?? '');
  const provided = getQuery(event).key;
  if (!expected || provided !== expected) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not found',
    });
  }

  throw new Error('Sentry example API route error');
});
