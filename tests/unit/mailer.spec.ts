import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formatMailFrom, sendMail, type MailClient, type MailerConfig } from '@/server/utils/mailer';

const defaultConfig: MailerConfig = {
  allowlist: [],
  apiKey: 're_test',
  from: 'Gear Closet <noreply@example.com>',
};

function mailClient (send: MailClient['emails']['send']): MailClient {
  return { emails: { send } };
}

describe('sendMail', () => {
  let config: MailerConfig;

  beforeEach(() => {
    config = { ...defaultConfig, allowlist: [] };
  });

  it('prefixes a bare from address with Gear Closet', () => {
    expect(formatMailFrom('noreply@example.com'))
      .toBe('Gear Closet <noreply@example.com>');
    expect(formatMailFrom('Gear Closet <noreply@example.com>'))
      .toBe('Gear Closet <noreply@example.com>');
  });

  it('sends html/text through Resend with an optional template tag', async () => {
    const send = vi.fn()
      .mockResolvedValue({
        data: { id: 'email_123' },
        error: null,
      });

    await expect(sendMail({
      html: '<p>Join the trip</p>',
      subject: 'Trip invite',
      templateId: 'trip-invite',
      text: 'Join the trip',
      to: 'pat@example.com',
    }, { client: mailClient(send), config }))
      .resolves
      .toEqual({ id: 'email_123' });

    expect(send)
      .toHaveBeenCalledWith({
        from: 'Gear Closet <noreply@example.com>',
        html: '<p>Join the trip</p>',
        subject: 'Trip invite',
        tags: [{ name: 'template', value: 'trip-invite' }],
        text: 'Join the trip',
        to: ['pat@example.com'],
      });
  });

  it('sets the Gear Closet from-name when config.from is a bare address', async () => {
    config.from = 'noreply@example.com';
    const send = vi.fn()
      .mockResolvedValue({
        data: { id: 'email_123' },
        error: null,
      });

    await sendMail({
      html: '<p>Hi</p>',
      subject: 'Hi',
      to: 'pat@example.com',
    }, { client: mailClient(send), config });

    expect(send)
      .toHaveBeenCalledWith(expect.objectContaining({
        from: 'Gear Closet <noreply@example.com>',
      }));
  });

  it('refuses recipients outside the staging allowlist', async () => {
    config.allowlist = ['pat@example.com'];
    const send = vi.fn();

    await expect(sendMail({
      html: '<p>Hi</p>',
      subject: 'Hi',
      to: 'other@example.com',
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
      html: '<p>Hi</p>',
      subject: 'Hi',
      to: 'pat@example.com',
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
      html: '<p>Hi</p>',
      subject: 'Hi',
      to: 'pat@example.com',
    }, { client: mailClient(send), config }))
      .rejects
      .toMatchObject({ statusCode: 502 });
  });
});
