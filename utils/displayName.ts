import type { DisplayNameProfile } from '@/types/profile';

interface FriendlyUsernameOptions {
  includeTrailName?: boolean;
}

/**
 * Returns a friendly username for a profile.
 */
export const friendlyUsername = (user: DisplayNameProfile | null | undefined, options?: FriendlyUsernameOptions) => {
  if (!user) return initials(user);
  if (options?.includeTrailName && user.trail_name) {
    return `${user.first_name} "${user.trail_name}" ${user.last_name}`;
  }
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name && !user.last_name) return user.first_name;
  return user.email;
};

/**
 * Returns the initials of a user.
 */
export const initials = (user: DisplayNameProfile | null | undefined) => {
  const base = 'GC';
  if (!user) return base;
  const firstInitial = user.first_name?.charAt(0);
  const lastInitial = user.last_name?.charAt(0);
  return firstInitial && lastInitial ? `${firstInitial}${lastInitial}` : base;
};
