import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import ForumPost from '@/components/dashboard/ForumPost.vue';
import { forumPosts } from '@/tests/unit/mocks/dashboard.mock';

const post = forumPosts.latest_posts[0]!;

describe('ForumPost', () => {
  it('renders a preview that is not a link for Free users', async () => {
    const wrapper = await mountSuspended(ForumPost, {
      props: {
        post,
        hasForumAccess: false,
      },
    });

    expect(wrapper.find('a')
      .exists())
      .toBe(false);
    expect(wrapper.text())
      .toContain('This is a test topic');
  });

  it('opens paid posts through the app /forums entry', async () => {
    const wrapper = await mountSuspended(ForumPost, {
      props: {
        post,
        hasForumAccess: true,
      },
    });

    expect(wrapper.get('a')
      .attributes('href'))
      .toBe('/forums?topic=this-is-a-test-topic');
  });
});
