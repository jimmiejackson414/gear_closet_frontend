import {
  EMAIL_BG,
  EMAIL_BRAND_NAME,
  EMAIL_CARD,
  EMAIL_MUTED,
  EMAIL_PRIMARY,
  EMAIL_TEXT,
  escapeHtml,
} from '@/server/emails/html';

export type EmailLayoutInput = {
  preheader: string;
  heading: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaUrl: string;
  footer?: string;
};

const button = (label: string, url: string) => `
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" bgcolor="${EMAIL_PRIMARY}" style="border-radius:999px;">
                    <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">${escapeHtml(label)}</a>
                  </td>
                </tr>
              </table>`;

export const renderEmailLayout = (input: EmailLayoutInput) => {
  const paragraphs = input.paragraphs
    .map(paragraph => `                <p style="margin:0 0 16px;font-size:16px;line-height:24px;color:${EMAIL_TEXT};">${paragraph}</p>`)
    .join('\n');
  const footer = input.footer
    ?? `You received this because someone invited you on ${EMAIL_BRAND_NAME}.`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(input.heading)}</title>
  </head>
  <body style="margin:0;padding:0;background:${EMAIL_BG};">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${escapeHtml(input.preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${EMAIL_BG};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;background:${EMAIL_CARD};border-radius:16px;">
            <tr>
              <td style="padding:32px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:${EMAIL_PRIMARY};">
                ${escapeHtml(EMAIL_BRAND_NAME)}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:22px;line-height:30px;font-weight:700;color:${EMAIL_TEXT};">
                ${escapeHtml(input.heading)}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
${paragraphs}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
                ${button(input.ctaLabel, input.ctaUrl)}
                <p style="margin:16px 0 0;font-size:13px;line-height:20px;color:${EMAIL_MUTED};">If the button does not work, copy this link:<br /><a href="${escapeHtml(input.ctaUrl)}" style="color:${EMAIL_PRIMARY};word-break:break-all;">${escapeHtml(input.ctaUrl)}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:${EMAIL_MUTED};">
                ${escapeHtml(footer)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
