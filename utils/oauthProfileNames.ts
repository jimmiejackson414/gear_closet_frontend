/**
 * Split OAuth user metadata into profile first/last name.
 * Keep in sync with private.profile_names_from_auth_metadata (migration 69).
 *
 * Prefer given/family (Google) or first/last (Facebook). Only split the
 * display name when those are missing — never dump the full name into first.
 */
export function profileNamesFromAuthMetadata (
  meta: Record<string, unknown> | null | undefined,
): { firstName: string | null; lastName: string | null } {
  const text = (key: string): string | null => {
    const value = meta?.[key];
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed || null;
  };

  const given = text('given_name') ?? text('first_name');
  const family = text('family_name') ?? text('last_name');
  if (given) {
    return { firstName: given, lastName: family };
  }

  const display = text('full_name') ?? text('name');
  if (!display) {
    return { firstName: null, lastName: null };
  }

  const space = display.indexOf(' ');
  if (space === -1) {
    return { firstName: display, lastName: null };
  }

  return {
    firstName: display.slice(0, space),
    lastName: display.slice(space + 1)
      .trim() || null,
  };
}
