/**
 * @api {get} /forumPosts Get latest forum posts
 * @apiName GetForumPosts
 * @summary Fetch the latest forum posts
 */
import { throwPublicError } from '@/server/utils/reportServerError';
import type { ForumCategories, ForumLatestPosts, ForumResponse } from '@/types/forum';

export default defineEventHandler(async (): Promise<ForumResponse> => {
  const config = useRuntimeConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const headers = {
      Accept: 'application/json',
      'Api-Key': config.forumsApiKey,
      'Api-Username': 'system',
    };

    const [latestPostData, categoriesData] = await Promise.all([
      $fetch<ForumLatestPosts>(`${config.public.forumsUrl}/posts`, {
        method: 'GET',
        headers,
        signal: controller.signal,
      }),
      $fetch<ForumCategories>(`${config.public.forumsUrl}/categories`, {
        method: 'GET',
        headers,
        signal: controller.signal,
      }),
    ]);

    const latest_posts = (latestPostData?.latest_posts ?? [])
      .filter(p => p.username !== 'system')
      .slice(0, 10);
    const categories = categoriesData?.category_list?.categories ?? [];

    return {
      latest_posts,
      categories,
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
