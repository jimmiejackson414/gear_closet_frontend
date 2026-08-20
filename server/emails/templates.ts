import { EMAIL_BRAND_NAME, escapeHtml, safeEmailLabel } from '@/server/emails/html';
import { renderEmailLayout } from '@/server/emails/layout';

export const EMAIL_TEMPLATE_IDS = {
  TRIP_INVITE: 'trip-invite',
  TRIP_INVITE_CLAIM: 'trip-invite-claim',
  FRIEND_REQUEST: 'friend-request',
} as const;

export type EmailTemplateId = typeof EMAIL_TEMPLATE_IDS[keyof typeof EMAIL_TEMPLATE_IDS];

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
  templateId: EmailTemplateId;
};

const tripCopy = (inviterName: string, tripName: string) => {
  const inviter = safeEmailLabel(inviterName) || 'A Gear Closet user';
  const trip = safeEmailLabel(tripName);
  return {
    inviter,
    heading: `${inviter} invited you to a trip`,
    preheader: trip
      ? `${inviter} invited you to ${trip} on ${EMAIL_BRAND_NAME}.`
      : `${inviter} invited you to a trip on ${EMAIL_BRAND_NAME}.`,
    htmlTrip: trip ? `<strong>${escapeHtml(trip)}</strong>` : 'a trip',
  };
};

const renderTripInvitation = (input: {
  inviterName: string;
  tripName: string;
  actionUrl: string;
  templateId: typeof EMAIL_TEMPLATE_IDS.TRIP_INVITE | typeof EMAIL_TEMPLATE_IDS.TRIP_INVITE_CLAIM;
}): RenderedEmail => {
  const copy = tripCopy(input.inviterName, input.tripName);
  const html = renderEmailLayout({
    preheader: copy.preheader,
    heading: copy.heading,
    paragraphs: [
      `${escapeHtml(copy.inviter)} invited you to ${copy.htmlTrip} on ${escapeHtml(EMAIL_BRAND_NAME)}.`,
      'Open the invitation to continue.',
    ],
    ctaLabel: 'Open invitation',
    ctaUrl: input.actionUrl,
  });
  const text = [
    copy.preheader,
    '',
    'Open the invitation to continue:',
    input.actionUrl,
    '',
    `You received this because someone invited you on ${EMAIL_BRAND_NAME}.`,
  ].join('\n');

  return {
    subject: copy.heading,
    html,
    text,
    templateId: input.templateId,
  };
};

export const renderTripInviteEmail = (input: {
  inviterName: string;
  tripName: string;
  acceptUrl: string;
}) =>
  renderTripInvitation({
    inviterName: input.inviterName,
    tripName: input.tripName,
    actionUrl: input.acceptUrl,
    templateId: EMAIL_TEMPLATE_IDS.TRIP_INVITE,
  });

export const renderTripInviteClaimEmail = (input: {
  inviterName: string;
  tripName: string;
  claimUrl: string;
}) =>
  renderTripInvitation({
    inviterName: input.inviterName,
    tripName: input.tripName,
    actionUrl: input.claimUrl,
    templateId: EMAIL_TEMPLATE_IDS.TRIP_INVITE_CLAIM,
  });

export const renderFriendRequestEmail = (input: {
  senderName: string;
  actionUrl: string;
}): RenderedEmail => {
  const sender = safeEmailLabel(input.senderName) || 'A Gear Closet user';
  const heading = `${sender} sent you a friend request`;
  const preheader = `${sender} sent you a friend request on ${EMAIL_BRAND_NAME}.`;
  const html = renderEmailLayout({
    preheader,
    heading,
    paragraphs: [
      `${escapeHtml(sender)} sent you a friend request on ${escapeHtml(EMAIL_BRAND_NAME)}.`,
      'Open the request to continue.',
    ],
    ctaLabel: 'View request',
    ctaUrl: input.actionUrl,
    footer: `You received this because someone sent you a friend request on ${EMAIL_BRAND_NAME}.`,
  });
  const text = [
    preheader,
    '',
    'Open the request to continue:',
    input.actionUrl,
    '',
    `You received this because someone sent you a friend request on ${EMAIL_BRAND_NAME}.`,
  ].join('\n');

  return {
    subject: heading,
    html,
    text,
    templateId: EMAIL_TEMPLATE_IDS.FRIEND_REQUEST,
  };
};

export const SAMPLE_EMAIL_DATA = {
  inviterName: 'Alex Rivera',
  tripName: 'Weekend on the AT',
  senderName: 'Alex Rivera',
  acceptUrl: 'https://app.gearcloset.io/',
  claimUrl: 'https://app.gearcloset.io/invite/trip?token=preview',
  friendsUrl: 'https://app.gearcloset.io/friends',
} as const;

export const renderEmailTemplate = (templateId: EmailTemplateId): RenderedEmail => {
  switch (templateId) {
    case EMAIL_TEMPLATE_IDS.TRIP_INVITE:
      return renderTripInviteEmail({
        inviterName: SAMPLE_EMAIL_DATA.inviterName,
        tripName: SAMPLE_EMAIL_DATA.tripName,
        acceptUrl: SAMPLE_EMAIL_DATA.acceptUrl,
      });
    case EMAIL_TEMPLATE_IDS.TRIP_INVITE_CLAIM:
      return renderTripInviteClaimEmail({
        inviterName: SAMPLE_EMAIL_DATA.inviterName,
        tripName: SAMPLE_EMAIL_DATA.tripName,
        claimUrl: SAMPLE_EMAIL_DATA.claimUrl,
      });
    case EMAIL_TEMPLATE_IDS.FRIEND_REQUEST:
      return renderFriendRequestEmail({
        senderName: SAMPLE_EMAIL_DATA.senderName,
        actionUrl: SAMPLE_EMAIL_DATA.friendsUrl,
      });
  }
};
