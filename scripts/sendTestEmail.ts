import dotenv from 'dotenv';
import { Resend } from 'resend';
import {
  assertRecipientsAllowed,
  normalizeMailRecipients,
  parseMailAllowlist,
} from '../server/utils/mailer';

dotenv.config();

/**
 * Staging smoke for the shared mailer.
 * @example pnpm mail:smoke you@example.com
 */
async function sendTestEmail () {
  const toArg = process.argv[2];
  if (!toArg) {
    console.error('Usage: pnpm mail:smoke <email>');
    process.exit(1);
  }

  const apiKey = process.env.NUXT_RESEND_API_KEY;
  const from = process.env.NUXT_MAIL_FROM;
  const allowlist = parseMailAllowlist(process.env.NUXT_MAIL_ALLOWLIST);

  if (!apiKey || !from) {
    console.error('Set NUXT_RESEND_API_KEY and NUXT_MAIL_FROM in .env');
    process.exit(1);
  }

  const to = normalizeMailRecipients(toArg);
  assertRecipientsAllowed(to, allowlist);

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: 'Gear Closet mailer smoke test',
    html: '<p>If you received this, the shared Resend mailer is working.</p>',
    text: 'If you received this, the shared Resend mailer is working.',
    tags: [{ name: 'template', value: 'mailer-smoke' }],
  });

  if (error || !data?.id) {
    console.error(error?.message || 'Failed to send email');
    process.exit(1);
  }

  console.log(`Sent smoke email ${data.id} to ${to.join(', ')}`);
}

void sendTestEmail();
