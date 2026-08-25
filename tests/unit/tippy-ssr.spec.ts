import { describe, expect, it } from 'vitest';
import { tippySsrDirective } from '@/plugins/tippy.server';

/**
 * Vue SSR resolves `v-tippy` then calls `dir.getSSRProps`. When the directive is
 * missing, `typeof dir !== 'function'` is still true, so it reads getSSRProps
 * on undefined — the Planning refresh crash.
 */
function vueSsrGetDirectiveProps (
  dir: { getSSRProps?: () => Record<string, unknown> } | undefined,
) {
  // Matches Vue 3.5: `typeof dir !== 'function' && dir.getSSRProps` does not
  // guard against an unregistered directive.
  const resolved = dir as { getSSRProps?: () => Record<string, unknown> };
  if (typeof dir !== 'function' && resolved.getSSRProps) {
    return resolved.getSSRProps();
  }
  return {};
}

describe('tippy SSR stub', () => {
  it('throws the Sentry getSSRProps error when v-tippy is unregistered', () => {
    expect(() => vueSsrGetDirectiveProps(undefined))
      .toThrow(/getSSRProps/);
  });

  it('lets Vue render v-tippy on the server', () => {
    expect(vueSsrGetDirectiveProps(tippySsrDirective))
      .toEqual({});
  });
});
