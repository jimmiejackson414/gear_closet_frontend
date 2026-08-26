import { z } from 'zod';

const emailSchema = z.string()
  .trim()
  .email();

export const escapeIlikeTerm = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');

/**
 * Turn free text into a tsquery the `search_profiles` RPC can parse.
 * `@`, `.`, and other punctuation in emails are tsquery syntax and make the
 * RPC fail, which is why Find New Friends could not accept an address.
 */
export const toSafeTsQuery = (raw: string): string | null => {
  const tokens = raw
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map(token => token.trim())
    .filter(token => token.length > 0);

  if (!tokens.length) return null;

  return tokens.map(token => `${token}:*`)
    .join(' & ');
};

export const parseFriendSearchEmail = (raw: string | null | undefined): string | null => {
  const parsed = emailSchema.safeParse(raw ?? '');
  return parsed.success ? parsed.data.toLowerCase() : null;
};

export const mergeProfileSearchResults = (
  groups: Array<Array<TablesProfile> | null | undefined>,
  excludeId?: string | null,
) => {
  const byId = new Map<string, TablesProfile>();
  for (const group of groups) {
    for (const profile of group ?? []) {
      if (!profile?.id || profile.id === excludeId) continue;
      byId.set(profile.id, profile);
    }
  }
  return [...byId.values()];
};

type TablesProfile = {
  id: string
  [key: string]: unknown
};
