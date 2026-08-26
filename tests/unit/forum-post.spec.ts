import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import ForumPost from '@/components/dashboard/ForumPost.vue';
import { forumPosts } from '@/tests/unit/mocks/dashboard.mock';

const post = forumPosts.latest_posts[0]!;

describe('ForumPost', () => {
  it('renders a preview that is not a link', async () => {
    const wrapper = await mountSuspended(ForumPost, {
      props: {
        post,
      },
    });

    expect(wrapper.find('a')
      .exists())
      .toBe(false);
    expect(wrapper.text())
      .toContain('This is a test topic');
  });
});
