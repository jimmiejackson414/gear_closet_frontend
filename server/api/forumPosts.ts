import type { ForumLatestPosts } from '@/types/helpers';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000); // Set timeout to 15 seconds

    const data = await $fetch<ForumLatestPosts>(`${config.public.forumsUrl}/posts`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': config.forumsApiKey,
        'api-username': 'system',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (data?.latest_posts?.length) {
      data.latest_posts = data.latest_posts.filter(p => p.username !== 'system')
        .slice(0, 10);
      return { data };
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