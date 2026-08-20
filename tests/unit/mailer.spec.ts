import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendMail, type MailClient, type MailerConfig } from '@/server/utils/mailer';

const defaultConfig: MailerConfig = {
  apiKey: 're_test',
  from: 'Gear Closet <noreply@example.com>',
  allowlist: [],
};

function mailClient (send: MailClient['emails']['send']): MailClient {
  return { emails: { send } };
}

describe('sendMail', () => {
  let config: MailerConfig;

  beforeEach(() => {
    config = { ...defaultConfig, allowlist: [] };
  });

  it('sends html/text through Resend with an optional template tag', async () => {
    const send = vi.fn()
      .mockResolvedValue({
        data: { id: 'email_123' },
        error: null,
      });

    await expect(sendMail({
      to: 'pat@example.com',
      subject: 'Trip invite',
      html: '<p>Join the trip</p>',
      text: 'Join the trip',
      templateId: 'trip-invite',
    }, { client: mailClient(send), config }))
      .resolves
      .toEqual({ id: 'email_123' });

    expect(send)
      .toHaveBeenCalledWith({
        from: 'Gear Closet <noreply@example.com>',
        to: ['pat@example.com'],
        subject: 'Trip invite',
        html: '<p>Join the trip</p>',
        text: 'Join the trip',
        tags: [{ name: 'template', value: 'trip-invite' }],
      });
  });

  it('refuses recipients outside the staging allowlist', async () => {
    config.allowlist = ['pat@example.com'];
    const send = vi.fn();

    await expect(sendMail({
      to: 'other@example.com',
      subject: 'Hi',
      html: '<p>Hi</p>',
    }, { client: mailClient(send), config }))
      .rejects
      .toMatchObject({ statusCode: 400 });
    expect(send)
      .not
      .toHaveBeenCalled();
  });

  it('requires a from address', async () => {
    config.from = '';
    const send = vi.fn();

    await expect(sendMail({
      to: 'pat@example.com',
      subject: 'Hi',
      html: '<p>Hi</p>',
    }, { client: mailClient(send), config }))
      .rejects
      .toMatchObject({ statusCode: 500 });
  });

  it('surfaces provider failures', async () => {
    const send = vi.fn()
      .mockResolvedValue({
        data: null,
        error: { message: 'Invalid API key' },
      });

    await expect(sendMail({
      to: 'pat@example.com',
      subject: 'Hi',
      html: '<p>Hi</p>',
    }, { client: mailClient(send), config }))
      .rejects
      .toMatchObject({ statusCode: 502 });
  });
});
