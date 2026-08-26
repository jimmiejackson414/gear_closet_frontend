/**
 * Stored on `notifications.title`. Keep these values stable — they are both
 * display copy today and the discriminator for deep-links. Prefer this enum
 * over a string literal so insert + routing cannot drift.
 *
 * A dedicated `kind` column would be the next step if we add more types or
 * localize titles.
 */
export enum NotificationKind {
  FRIEND_ACCEPTED = 'Friend request accepted',
  FRIEND_REQUEST = 'New Friend Request',
  TRIP_INVITE = "You've been invited to a trip!",
  TRIP_INVITE_ACCEPTED = 'Trip invite accepted',
  WELCOME = 'Welcome!',
}

const NOTIFICATION_ROUTES: Partial<Record<NotificationKind, { name: string }>> = {
  [NotificationKind.FRIEND_ACCEPTED]: { name: 'friends' },
  [NotificationKind.FRIEND_REQUEST]: { name: 'friends' },
  [NotificationKind.TRIP_INVITE]: { name: 'index' },
  [NotificationKind.TRIP_INVITE_ACCEPTED]: { name: 'index' },
};

export function notificationRoute (title: string | null | undefined) {
  if (!title) return null;
  return NOTIFICATION_ROUTES[title as NotificationKind] ?? null;
}
