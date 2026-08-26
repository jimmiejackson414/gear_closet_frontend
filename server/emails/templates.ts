import { EMAIL_BRAND_NAME, escapeHtml, safeEmailLabel } from '@/server/emails/html';
import { renderEmailLayout } from '@/server/emails/layout';

export const EMAIL_TEMPLATE_IDS = {
  FRIEND_REQUEST: 'friend-request',
  TRIP_INVITE: 'trip-invite',
  TRIP_INVITE_CLAIM: 'trip-invite-claim',
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
    heading: `${inviter} invited you to a trip`,
    htmlTrip: trip ? `<strong>${escapeHtml(trip)}</strong>` : 'a trip',
    inviter,
    preheader: trip
      ? `${inviter} invited you to ${trip} on ${EMAIL_BRAND_NAME}.`
      : `${inviter} invited you to a trip on ${EMAIL_BRAND_NAME}.`,
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
    ctaLabel: 'Open invitation',
    ctaUrl: input.actionUrl,
    heading: copy.heading,
    paragraphs: [
      `${escapeHtml(copy.inviter)} invited you to ${copy.htmlTrip} on ${escapeHtml(EMAIL_BRAND_NAME)}.`,
      'Open the invitation to continue.',
    ],
    preheader: copy.preheader,
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
    html,
    subject: copy.heading,
    templateId: input.templateId,
    text,
  };
};

export const renderTripInviteEmail = (input: {
  inviterName: string;
  tripName: string;
  acceptUrl: string;
}) =>
  renderTripInvitation({
    actionUrl: input.acceptUrl,
    inviterName: input.inviterName,
    templateId: EMAIL_TEMPLATE_IDS.TRIP_INVITE,
    tripName: input.tripName,
  });

export const renderTripInviteClaimEmail = (input: {
  inviterName: string;
  tripName: string;
  claimUrl: string;
}) =>
  renderTripInvitation({
    actionUrl: input.claimUrl,
    inviterName: input.inviterName,
    templateId: EMAIL_TEMPLATE_IDS.TRIP_INVITE_CLAIM,
    tripName: input.tripName,
  });

export const renderFriendRequestEmail = (input: {
  senderName: string;
  actionUrl: string;
}): RenderedEmail => {
  const sender = safeEmailLabel(input.senderName) || 'A Gear Closet user';
  const heading = `${sender} sent you a friend request`;
  const preheader = `${sender} sent you a friend request on ${EMAIL_BRAND_NAME}.`;
  const html = renderEmailLayout({
    ctaLabel: 'View request',
    ctaUrl: input.actionUrl,
    footer: `You received this because someone sent you a friend request on ${EMAIL_BRAND_NAME}.`,
    heading,
    paragraphs: [
      `${escapeHtml(sender)} sent you a friend request on ${escapeHtml(EMAIL_BRAND_NAME)}.`,
      'Open the request to continue.',
    ],
    preheader,
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
    html,
    subject: heading,
    templateId: EMAIL_TEMPLATE_IDS.FRIEND_REQUEST,
    text,
  };
};

export const SAMPLE_EMAIL_DATA = {
  acceptUrl: 'https://app.gearcloset.io/',
  claimUrl: 'https://app.gearcloset.io/invite/trip?token=preview',
  friendsUrl: 'https://app.gearcloset.io/friends',
  inviterName: 'Alex Rivera',
  senderName: 'Alex Rivera',
  tripName: 'Weekend on the AT',
} as const;

export const renderEmailTemplate = (templateId: EmailTemplateId): RenderedEmail => {
  switch (templateId) {
    case EMAIL_TEMPLATE_IDS.TRIP_INVITE:
      return renderTripInviteEmail({
        acceptUrl: SAMPLE_EMAIL_DATA.acceptUrl,
        inviterName: SAMPLE_EMAIL_DATA.inviterName,
        tripName: SAMPLE_EMAIL_DATA.tripName,
      });
    case EMAIL_TEMPLATE_IDS.TRIP_INVITE_CLAIM:
      return renderTripInviteClaimEmail({
        claimUrl: SAMPLE_EMAIL_DATA.claimUrl,
        inviterName: SAMPLE_EMAIL_DATA.inviterName,
        tripName: SAMPLE_EMAIL_DATA.tripName,
      });
    case EMAIL_TEMPLATE_IDS.FRIEND_REQUEST:
      return renderFriendRequestEmail({
        actionUrl: SAMPLE_EMAIL_DATA.friendsUrl,
        senderName: SAMPLE_EMAIL_DATA.senderName,
      });
  }
};
