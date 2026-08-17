import { describe, expect, it } from 'vitest';
import { NotificationKind, notificationRoute } from '@/utils/notifications';

describe('notificationRoute', () => {
  it('sends friend-request notifications to Friends', () => {
    expect(notificationRoute(NotificationKind.FRIEND_REQUEST))
      .toEqual({ name: 'friends' });
  });

  it('sends trip-invite notifications to the dashboard', () => {
    expect(notificationRoute(NotificationKind.TRIP_INVITE))
      .toEqual({ name: 'index' });
  });

  it('returns null for welcome and unknown titles', () => {
    expect(notificationRoute(NotificationKind.WELCOME))
      .toBeNull();
    expect(notificationRoute('something else'))
      .toBeNull();
    expect(notificationRoute(null))
      .toBeNull();
  });
});
