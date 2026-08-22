import { isForumsConfigured, normalizeForumsUrl } from '@/server/utils/forumsConfig';

export const FORUMS_APP_PATH = '/forums';
export const FORUMS_UPGRADE_PATH = '/profile?tab=subscription';

export type ForumsRedirectQuery = {
  topic?: string | string[];
  category?: string | string[];
  categoryId?: string | string[];
};

const firstQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
};

export const forumsTopicUrl = (base: string | undefined | null, topicSlug: string) => {
  const root = normalizeForumsUrl(base);
  const slug = topicSlug.trim();
  if (!root || !slug) return '';
  return `${root}/t/${slug}`;
};

export const forumsCategoryUrl = (
  base: string | undefined | null,
  slug: string,
  id: number | string,
) => {
  const root = normalizeForumsUrl(base);
  const categorySlug = slug.trim();
  const categoryId = String(id)
    .trim();
  if (!root || !categorySlug || !categoryId) return '';
  return `${root}/c/${categorySlug}/${categoryId}`;
};

export const forumsAppPath = (target?: {
  topic?: string;
  category?: string;
  categoryId?: number;
}) => {
  if (target?.topic) {
    return `${FORUMS_APP_PATH}?topic=${encodeURIComponent(target.topic)}`;
  }
  if (target?.category && target.categoryId != null) {
    const params = new URLSearchParams({
      category: target.category,
      categoryId: String(target.categoryId),
    });
    return `${FORUMS_APP_PATH}?${params.toString()}`;
  }
  return FORUMS_APP_PATH;
};

export const resolveForumsRedirect = (
  base: string | undefined | null,
  query: ForumsRedirectQuery = {},
) => {
  const topic = firstQueryValue(query.topic)
    .trim();
  if (topic) return forumsTopicUrl(base, topic);

  const category = firstQueryValue(query.category)
    .trim();
  const categoryId = firstQueryValue(query.categoryId)
    .trim();
  if (category && categoryId) return forumsCategoryUrl(base, category, categoryId);

  return normalizeForumsUrl(base);
};

export { isForumsConfigured, normalizeForumsUrl };
