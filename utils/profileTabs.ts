export const PROFILE_TABS = ['profile', 'subscription', 'settings'] as const;
export type ProfileTab = typeof PROFILE_TABS[number];

export const profileTabFromQuery = (value: unknown): ProfileTab => {
  if (typeof value === 'string' && (PROFILE_TABS as readonly string[]).includes(value)) {
    return value as ProfileTab;
  }
  return 'profile';
};
