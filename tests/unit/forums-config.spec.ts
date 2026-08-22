import { describe, expect, it } from 'vitest';
import {
  EMPTY_FORUM_RESPONSE,
  isForumsConfigured,
  normalizeForumsUrl,
} from '@/server/utils/forumsConfig';

describe('forumsConfig', () => {
  it('treats a missing forums URL as unconfigured', () => {
    expect(isForumsConfigured(''))
      .toBe(false);
    expect(isForumsConfigured('http://localhost:3000'))
      .toBe(true);
    expect(EMPTY_FORUM_RESPONSE)
      .toEqual({ latest_posts: [], categories: [] });
  });

  it('strips a trailing slash from the forums URL', () => {
    expect(normalizeForumsUrl('http://localhost:3000/'))
      .toBe('http://localhost:3000');
  });
});
