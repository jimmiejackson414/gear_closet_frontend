import { describe, expect, it } from 'vitest';
import {
  AUTH_CALLBACK_PATH,
  authCallbackUrl,
  destinationAfterAuth,
  isPasswordRecoveryCallback,
  pathAfterOnboarding,
  planningTripPath,
  safeInternalPath,
} from '@/utils/authRedirect';

describe('authRedirect', () => {
  it('builds the callback URL for email and OAuth redirects', () => {
    expect(authCallbackUrl('https://app.example'))
      .toBe('https://app.example/callback');
    expect(authCallbackUrl('https://app.example', { type: 'recovery' }))
      .toBe('https://app.example/callback?type=recovery');
    expect(AUTH_CALLBACK_PATH)
      .toBe('/callback');
  });

  it('accepts relative app paths and query strings', () => {
    expect(safeInternalPath('/planning?trip=12'))
      .toBe('/planning?trip=12');
    expect(safeInternalPath('/invite/trip?token=abc'))
      .toBe('/invite/trip?token=abc');
  });

  it('rejects protocol-relative and auth-loop paths', () => {
    expect(safeInternalPath('https://evil.example'))
      .toBeNull();
    expect(safeInternalPath('//evil.example'))
      .toBeNull();
    expect(safeInternalPath('/login'))
      .toBeNull();
    expect(safeInternalPath('/callback?code=abc'))
      .toBeNull();
    expect(safeInternalPath(null))
      .toBeNull();
  });

  it('sends incomplete users to onboarding without consuming the saved path', () => {
    expect(destinationAfterAuth({
      onboardDate: null,
      savedPath: '/planning?trip=12',
    }))
      .toEqual({ path: '/onboarding', consumeSavedPath: false });
  });

  it('returns onboarded users to the saved path', () => {
    expect(destinationAfterAuth({
      onboardDate: '2026-01-01T00:00:00.000Z',
      savedPath: '/planning?trip=12',
    }))
      .toEqual({ path: '/planning?trip=12', consumeSavedPath: true });
  });

  it('sends password recovery to reset-password', () => {
    expect(destinationAfterAuth({
      onboardDate: '2026-01-01T00:00:00.000Z',
      savedPath: '/planning',
      isPasswordRecovery: true,
    }))
      .toEqual({ path: '/reset-password', consumeSavedPath: false });
    expect(isPasswordRecoveryCallback('recovery', ''))
      .toBe(true);
    expect(isPasswordRecoveryCallback(undefined, '#type=recovery&access_token=x'))
      .toBe(true);
    expect(isPasswordRecoveryCallback(undefined, ''))
      .toBe(false);
  });

  it('resumes the saved path after onboarding', () => {
    expect(pathAfterOnboarding('/planning?trip=12'))
      .toBe('/planning?trip=12');
    expect(pathAfterOnboarding('/login'))
      .toBe('/');
    expect(pathAfterOnboarding(null))
      .toBe('/');
  });

  it('builds a planning deep-link for a claimed trip', () => {
    expect(planningTripPath('gc1.abc'))
      .toBe('/planning?trip=gc1.abc');
    expect(destinationAfterAuth({
      onboardDate: '2026-01-01T00:00:00.000Z',
      savedPath: planningTripPath('gc1.abc'),
    }))
      .toEqual({ path: '/planning?trip=gc1.abc', consumeSavedPath: true });
    expect(destinationAfterAuth({
      onboardDate: null,
      savedPath: planningTripPath('gc1.abc'),
    }))
      .toEqual({ path: '/onboarding', consumeSavedPath: false });
  });
});
