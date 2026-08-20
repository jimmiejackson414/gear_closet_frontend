import { Resend } from 'resend';

export class MailerError extends Error {
  statusCode: number;

  constructor (message: string, statusCode = 500) {
    super(message);
    this.name = 'MailerError';
    this.statusCode = statusCode;
  }
}

export type SendMailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  /** Template id tagged on the Resend send (`trip-invite`, `trip-invite-claim`, `friend-request`). */
  templateId?: string;
};

export type MailClient = {
  emails: {
    send: (payload: {
      from: string;
      to: string[];
      subject: string;
      html: string;
      text?: string;
      tags?: Array<{ name: string; value: string }>;
    }) => Promise<{
      data: { id: string } | null;
      error: { message: string } | null;
    }>;
  };
};

export type MailerConfig = {
  apiKey: string;
  from: string;
  allowlist: string[];
};

let resendClient: Resend | undefined;

export const parseMailAllowlist = (raw: string | undefined | null) =>
  (raw ?? '')
    .split(',')
    .map(entry => entry.trim()
      .toLowerCase())
    .filter(Boolean);

export const normalizeMailRecipients = (to: string | string[]) => {
  const list = (Array.isArray(to) ? to : [to])
    .map(entry => entry.trim())
    .filter(Boolean);
  if (!list.length) {
    throw new Error('sendMail requires at least one recipient');
  }
  return list;
};

export const assertRecipientsAllowed = (recipients: string[], allowlist: string[]) => {
  if (!allowlist.length) return;
  const blocked = recipients.filter(recipient =>
    !allowlist.includes(recipient.toLowerCase()));
  if (blocked.length) {
    throw new Error(`Recipient not on mail allowlist: ${blocked.join(', ')}`);
  }
};

const templateTagValue = (templateId: string | undefined) => {
  if (!templateId) return undefined;
  const value = templateId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .slice(0, 50);
  return value || undefined;
};

export const formatMailFrom = (from: string) => {
  const trimmed = from.trim();
  if (!trimmed) return trimmed;
  if (trimmed.includes('<')) return trimmed;
  return `Gear Closet <${trimmed}>`;
};

export const readMailerConfig = (): MailerConfig => {
  const config = useRuntimeConfig();
  return {
    apiKey: String(config.resendApiKey ?? ''),
    from: formatMailFrom(String(config.mailFrom ?? '')),
    allowlist: parseMailAllowlist(String(config.mailAllowlist ?? '')),
  };
};

export const useResendClient = (config = readMailerConfig()): Resend => {
  if (resendClient) return resendClient;
  if (!config.apiKey) {
    throw new MailerError('Missing NUXT_RESEND_API_KEY');
  }
  resendClient = new Resend(config.apiKey);
  return resendClient;
};

export const sendMail = async (
  input: SendMailInput,
  extras?: { client?: MailClient; config?: MailerConfig },
) => {
  const config = extras?.config ?? readMailerConfig();
  if (!config.from) {
    throw new MailerError('Missing NUXT_MAIL_FROM');
  }

  let to: string[];
  try {
    to = normalizeMailRecipients(input.to);
    assertRecipientsAllowed(to, config.allowlist);
  } catch (error) {
    throw new MailerError(
      error instanceof Error ? error.message : 'Invalid mail recipients',
      400,
    );
  }

  const tagValue = templateTagValue(input.templateId);
  const mailer = extras?.client ?? useResendClient(config);
  const { data, error } = await mailer.emails.send({
    from: formatMailFrom(config.from),
    to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    tags: tagValue ? [{ name: 'template', value: tagValue }] : undefined,
  });

  if (error || !data?.id) {
    throw new MailerError(error?.message || 'Failed to send email', 502);
  }

  return { id: data.id };
};
