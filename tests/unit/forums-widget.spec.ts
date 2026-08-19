import { mountSuspended } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import ForumsWidget from '@/components/dashboard/ForumsWidget.vue';
import { useUserStore } from '@/stores/user';
import { forumPosts } from '@/tests/unit/mocks/dashboard.mock';

describe('ForumsWidget', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders skeleton while loading', async () => {
    const wrapper = await mountSuspended(ForumsWidget, {
      props: {
        loading: true,
        data: { latest_posts: [], categories: [] },
      },
    });

    expect(wrapper.findComponent({ name: 'GcSkeleton' })
.exists())
      .toBe(true);
    expect(wrapper.text())
      .not
      .toContain('Error occurred fetching forum posts.');
  });

  it('renders an empty community state when there are no posts', async () => {
    const wrapper = await mountSuspended(ForumsWidget, {
      props: {
        loading: false,
        data: { latest_posts: [], categories: [] },
      },
    });

    expect(wrapper.text())
      .not
      .toContain('Error occurred fetching forum posts.');
    expect(wrapper.text())
      .toContain('Forum previews will show here');
    expect(wrapper.text())
      .toContain('Upgrade in Profile');
  });

  it('renders fetch error separately from empty posts', async () => {
    const wrapper = await mountSuspended(ForumsWidget, {
      props: {
        loading: false,
        error: true,
        data: { latest_posts: [], categories: [] },
      },
    });

    expect(wrapper.text())
      .toContain('Error occurred fetching forum posts.');
  });

  it('renders posts and categories when data is present', async () => {
    const store = useUserStore();
    store.profile = {
      subscriptions: [{ prices: { identifier: 'MONTHLY' } }],
    } as any;

    const wrapper = await mountSuspended(ForumsWidget, {
      props: {
        loading: false,
        data: {
          latest_posts: forumPosts.latest_posts,
          categories: forumPosts.categories,
        },
      },
    });

    expect(wrapper.text())
      .toContain('This is a test topic');
    expect(wrapper.text())
      .toContain('General');
    expect(wrapper.text())
      .toContain('topics');
    expect(wrapper.text())
      .not
      .toContain('Error occurred fetching forum posts.');
  });
});
