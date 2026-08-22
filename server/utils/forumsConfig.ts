import type { ForumResponse } from '@/types/forum';

export const EMPTY_FORUM_RESPONSE: ForumResponse = {
  latest_posts: [],
  categories: [],
};

export const normalizeForumsUrl = (raw: string | undefined | null) =>
  String(raw ?? '')
    .trim()
    .replace(/\/$/, '');

export const isForumsConfigured = (url: string | undefined | null) =>
  Boolean(normalizeForumsUrl(url));
