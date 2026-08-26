import {
  EMPTY_FORUM_RESPONSE,
  isForumsConfigured,
  normalizeForumsUrl,
} from '@/server/utils/forumsConfig';
/**
 * @api {get} /forumPosts Get latest forum posts
 * @apiName GetForumPosts
 * @summary Fetch the latest forum posts
 */
import { throwPublicError } from '@/server/utils/reportServerError';
import type { ForumCategories, ForumLatestPosts, ForumResponse } from '@/types/forum';

export default defineEventHandler(async (): Promise<ForumResponse> => {
  const config = useRuntimeConfig();
  const forumsUrl = normalizeForumsUrl(config.public.forumsUrl);
  const apiKey = String(config.forumsApiKey ?? '')
    .trim();
  const apiUsername = String(config.forumsApiUsername ?? 'system')
    .trim() || 'system';

  if (!isForumsConfigured(forumsUrl)) {
    return EMPTY_FORUM_RESPONSE;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (apiKey) {
      headers['Api-Key'] = apiKey;
      headers['Api-Username'] = apiUsername;
    }

    const [latestPostData, categoriesData] = await Promise.all([
      $fetch<ForumLatestPosts>(`${forumsUrl}/posts`, {
        headers,
        method: 'GET',
        signal: controller.signal,
      }),
      $fetch<ForumCategories>(`${forumsUrl}/categories`, {
        headers,
        method: 'GET',
        signal: controller.signal,
      }),
    ]);

    const latest_posts = (latestPostData?.latest_posts ?? [])
      .filter(p => p.username !== 'system')
      .slice(0, 10);
    const categories = categoriesData?.category_list?.categories ?? [];

    return {
      categories,
      latest_posts,
    };
  } catch (err) {
    return throwPublicError(err, {
      statusCode: 500,
      statusMessage: 'An error occurred while fetching posts',
      tags: { route: '/api/forumPosts' },
    });
  } finally {
    clearTimeout(timeout);
  }
});
