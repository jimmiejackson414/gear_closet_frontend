import dotenv from 'dotenv';
import { Resend } from 'resend';
import {
  EMAIL_TEMPLATE_IDS,
  renderEmailTemplate,
  type EmailTemplateId,
} from '../server/emails/templates';
import {
  assertRecipientsAllowed,
  formatMailFrom,
  normalizeMailRecipients,
  parseMailAllowlist,
} from '../server/utils/mailer';

dotenv.config();

const TEMPLATE_IDS = Object.values(EMAIL_TEMPLATE_IDS);

const isTemplateId = (value: string): value is EmailTemplateId =>
  TEMPLATE_IDS.includes(value as EmailTemplateId);

/**
 * Staging smoke for transactional templates.
 * @example pnpm mail:smoke you@example.com
 * @example pnpm mail:smoke you@example.com trip-invite
 * @example pnpm mail:smoke you@example.com trip-invite-claim
 * @example pnpm mail:smoke you@example.com friend-request
 */
async function sendTestEmail () {
  const toArg = process.argv[2];
  const templateArg = process.argv[3] ?? EMAIL_TEMPLATE_IDS.TRIP_INVITE;
  if (!toArg) {
    console.error('Usage: pnpm mail:smoke <email> [trip-invite|trip-invite-claim|friend-request]');
    process.exit(1);
  }
  if (!isTemplateId(templateArg)) {
    console.error(`Unknown template "${templateArg}". Use: ${TEMPLATE_IDS.join(', ')}`);
    process.exit(1);
  }

  const apiKey = process.env.NUXT_RESEND_API_KEY;
  const fromRaw = process.env.NUXT_MAIL_FROM;
  const allowlist = parseMailAllowlist(process.env.NUXT_MAIL_ALLOWLIST);

  if (!apiKey || !fromRaw) {
    console.error('Set NUXT_RESEND_API_KEY and NUXT_MAIL_FROM in .env');
    process.exit(1);
  }

  const to = normalizeMailRecipients(toArg);
  assertRecipientsAllowed(to, allowlist);

  const message = renderEmailTemplate(templateArg);
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: formatMailFrom(fromRaw),
    html: message.html,
    subject: message.subject,
    tags: [{ name: 'template', value: message.templateId }],
    text: message.text,
    to,
  });

  if (error || !data?.id) {
    console.error(error?.message || 'Failed to send email');
    process.exit(1);
  }

  console.log(`Sent ${message.templateId} ${data.id} to ${to.join(', ')}`);
}

void sendTestEmail();
