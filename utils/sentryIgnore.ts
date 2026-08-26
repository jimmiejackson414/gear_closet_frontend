const REPORTED = Symbol.for('gearCloset.sentryReported');

export const resolveSentryEnabled = (input: {
  enabledFlag?: unknown
  dsn?: string | null
  isProduction?: boolean
}) => {
  const dsn = input.dsn?.trim() ?? '';
  if (!dsn) return false;

  const flag = String(input.enabledFlag ?? '')
    .trim()
    .toLowerCase();
  if (flag === 'false' || flag === '0') return false;
  if (flag === 'true' || flag === '1') return true;
  return Boolean(input.isProduction);
};

const statusFromUnknown = (value: unknown): number | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  if (typeof record.statusCode === 'number') return record.statusCode;
  if (typeof record.status === 'number') return record.status;
  return statusFromUnknown(record.cause);
};

export const sentryStatusCode = (error: unknown) => statusFromUnknown(error);

export const shouldIgnoreSentryError = (error: unknown) => {
  if (error == null) return true;

  const status = sentryStatusCode(error);
  if (status === 401 || status === 403 || status === 404) return true;
  if (status != null && status >= 300 && status < 400) return true;

  const name = error instanceof Error ? error.name : '';
  const message = error instanceof Error ? error.message : String(error);
  if (name === 'AbortError' || name === 'NavigationDuplicated') return true;
  if (/^redirected$/i.test(message) || /ResizeObserver loop/i.test(message)) return true;
  return false;
};

export const wasSentryReported = (error: unknown) =>
  Boolean(error && typeof error === 'object' && REPORTED in error);

export const markSentryReported = (error: unknown) => {
  if (!error || typeof error !== 'object' || wasSentryReported(error)) return;
  Object.defineProperty(error, REPORTED, { enumerable: false, value: true });
};

export const reportErrorOnce = (
  error: unknown,
  capture: (error: unknown) => void,
) => {
  if (shouldIgnoreSentryError(error) || wasSentryReported(error)) return;
  markSentryReported(error);
  capture(error);
};

export const filterSentryEvent = <T>(event: T, originalException: unknown): T | null => {
  if (originalException == null) return event;
  if (shouldIgnoreSentryError(originalException) || wasSentryReported(originalException)) {
    return null;
  }
  markSentryReported(originalException);
  return event;
};
