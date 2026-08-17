export const AUTH_CALLBACK_PATH = '/callback';

const BLOCKED_AUTH_PATHS = [
  '/login',
  '/register',
  '/callback',
  '/confirm',
  '/forgot-password',
];

export function authCallbackUrl (origin: string, query?: Record<string, string>): string {
  const url = new URL(AUTH_CALLBACK_PATH, origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

/** Relative app paths only — reject protocol-relative and auth-loop URLs. */
export function safeInternalPath (path: string | null | undefined): string | null {
  if (!path || typeof path !== 'string') return null;
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return null;

  const pathname = path.split('?')[0]?.split('#')[0] ?? path;
  if (BLOCKED_AUTH_PATHS.some((blocked) => pathname === blocked || pathname.startsWith(`${blocked}/`))) {
    return null;
  }

  return path;
}

export function destinationAfterAuth (input: {
  onboardDate: string | null | undefined;
  savedPath?: string | null;
  isPasswordRecovery?: boolean;
}): { path: string; consumeSavedPath: boolean } {
  if (input.isPasswordRecovery) {
    return { path: '/reset-password', consumeSavedPath: false };
  }

  if (!input.onboardDate) {
    return { path: '/onboarding', consumeSavedPath: false };
  }

  const saved = safeInternalPath(input.savedPath ?? null);
  return { path: saved ?? '/', consumeSavedPath: true };
}

export function pathAfterOnboarding (savedPath: string | null | undefined): string {
  return safeInternalPath(savedPath) ?? '/';
}

export function isPasswordRecoveryCallback (queryType: unknown, hash: string): boolean {
  if (queryType === 'recovery') return true;
  return hash.includes('type=recovery');
}
