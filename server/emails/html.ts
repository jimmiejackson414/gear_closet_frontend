export const EMAIL_BRAND_NAME = 'Gear Closet';
export const EMAIL_PRIMARY = '#005289';
export const EMAIL_TEXT = '#1f2937';
export const EMAIL_MUTED = '#6b7280';
export const EMAIL_BG = '#f4f6f8';
export const EMAIL_CARD = '#ffffff';
export const MAX_EMAIL_LABEL_LENGTH = 80;

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Cap and collapse whitespace so user-generated names stay safe in subject/body. */
export const safeEmailLabel = (value: string | null | undefined) =>
  (value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_EMAIL_LABEL_LENGTH);
