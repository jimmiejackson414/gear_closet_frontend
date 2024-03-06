import type { ForumLatestPosts, ForumCategories } from '@/types/helpers';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000); // Set timeout to 15 seconds

    const latestPostData = await $fetch<ForumLatestPosts>(`${config.public.forumsUrl}/posts`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Api-Key': config.forumsApiKey,
        'Api-Username': 'system',
      },
      signal: controller.signal,
    });

    const categoriesData = await $fetch<ForumCategories>(`${config.public.forumsUrl}/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Api-Key': config.forumsApiKey,
        'Api-Username': 'system',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (latestPostData?.latest_posts?.length && categoriesData?.category_list?.categories?.length) {
      latestPostData.latest_posts = latestPostData.latest_posts.filter(p => p.username !== 'system')
        .slice(0, 10);
      return {
        latest_posts: latestPostData.latest_posts || [],
        categories: categoriesData.category_list.categories || [],
      };
    }

    throw createError({
      statusCode: 400,
      statusMessage: 'No posts found',
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching posts',
    });
  }
});