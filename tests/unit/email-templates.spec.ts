import { describe, expect, it } from 'vitest';
import { EMAIL_BRAND_NAME, escapeHtml, safeEmailLabel } from '@/server/emails/html';
import {
  EMAIL_TEMPLATE_IDS,
  renderFriendRequestEmail,
  renderTripInviteClaimEmail,
  renderTripInviteEmail,
} from '@/server/emails/templates';

const ACCOUNT_LEAK = /account exists|no account|create an account|found your account|don't have an account|sign up|register|dashboard|log in to your account/i;

describe('email templates', () => {
  it('escapes user-generated names and omits blank trip names', () => {
    expect(escapeHtml('<script>"x"'))
      .toBe('&lt;script&gt;&quot;x&quot;');
    expect(safeEmailLabel('  Weekend   on the AT  '))
      .toBe('Weekend on the AT');
    expect(safeEmailLabel('x'.repeat(90)))
      .toHaveLength(80);

    const omitted = renderTripInviteEmail({
      acceptUrl: 'https://app.gearcloset.io/',
      inviterName: 'Jimmie',
      tripName: '   ',
    });
    expect(omitted.html)
      .toContain('invited you to a trip on');
    expect(omitted.html)
      .not
      .toContain('<strong></strong>');
  });

  it('renders matching trip-invite copy that does not mention accounts', () => {
    const existing = renderTripInviteEmail({
      acceptUrl: 'https://app.gearcloset.io/',
      inviterName: 'Jimmie <script>',
      tripName: 'AT Thru',
    });
    const claim = renderTripInviteClaimEmail({
      claimUrl: 'https://app.gearcloset.io/invite/trip?token=abc',
      inviterName: 'Jimmie <script>',
      tripName: 'AT Thru',
    });

    expect(existing.templateId)
      .toBe(EMAIL_TEMPLATE_IDS.TRIP_INVITE);
    expect(claim.templateId)
      .toBe(EMAIL_TEMPLATE_IDS.TRIP_INVITE_CLAIM);
    expect(existing.subject)
      .toBe('Jimmie <script> invited you to a trip');
    expect(claim.subject)
      .toBe(existing.subject);
    expect(existing.html)
      .toContain(EMAIL_BRAND_NAME);
    expect(existing.html)
      .toContain('Open invitation');
    expect(existing.html)
      .toContain('Jimmie &lt;script&gt;');
    expect(existing.html)
      .toContain('AT Thru');
    expect(existing.html)
      .not
      .toMatch(ACCOUNT_LEAK);
    expect(claim.html)
      .not
      .toMatch(ACCOUNT_LEAK);
    expect(existing.text)
      .not
      .toMatch(ACCOUNT_LEAK);
    expect(claim.text)
      .not
      .toMatch(ACCOUNT_LEAK);
    expect(existing.html)
      .toContain('https://app.gearcloset.io/');
    expect(claim.html)
      .toContain('/invite/trip?token=abc');
  });

  it('renders an optional friend-request template without account copy', () => {
    const message = renderFriendRequestEmail({
      actionUrl: 'https://app.gearcloset.io/friends',
      senderName: 'Shelly',
    });

    expect(message)
      .toMatchObject({
        subject: 'Shelly sent you a friend request',
        templateId: EMAIL_TEMPLATE_IDS.FRIEND_REQUEST,
      });
    expect(message.html)
      .toContain('View request');
    expect(message.html)
      .not
      .toMatch(ACCOUNT_LEAK);
  });
});
