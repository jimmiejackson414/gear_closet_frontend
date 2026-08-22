import { describe, expect, it } from 'vitest';
import { profileTabFromQuery } from '@/utils/profileTabs';

describe('profileTabFromQuery', () => {
  it('opens the subscription tab from a query value', () => {
    expect(profileTabFromQuery('subscription'))
      .toBe('subscription');
    expect(profileTabFromQuery('settings'))
      .toBe('settings');
  });

  it('falls back to profile for missing or unknown tabs', () => {
    expect(profileTabFromQuery(undefined))
      .toBe('profile');
    expect(profileTabFromQuery('billing'))
      .toBe('profile');
  });
});
