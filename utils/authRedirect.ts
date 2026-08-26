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
    return { consumeSavedPath: false, path: '/reset-password' };
  }

  if (!input.onboardDate) {
    return { consumeSavedPath: false, path: '/onboarding' };
  }

  const saved = safeInternalPath(input.savedPath ?? null);
  return { consumeSavedPath: true, path: saved ?? '/' };
}

export function pathAfterOnboarding (savedPath: string | null | undefined): string {
  return safeInternalPath(savedPath) ?? '/';
}

/** Planning deep-link used after a successful email-invite claim. */
export function planningTripPath (encryptedTripId: string): string {
  return `/planning?trip=${encryptedTripId}`;
}

/** Return path for a shared public pack page (optional comments tab). */
export function publicPackPath (slug: string, tab?: 'comments'): string | null {
  const trimmed = slug.trim();
  if (!trimmed) return null;

  const base = `/p/packs/${encodeURIComponent(trimmed)}`;
  const path = tab === 'comments' ? `${base}?tab=comments` : base;
  return safeInternalPath(path);
}

export function isPasswordRecoveryCallback (queryType: unknown, hash: string): boolean {
  if (queryType === 'recovery') return true;
  return hash.includes('type=recovery');
}
