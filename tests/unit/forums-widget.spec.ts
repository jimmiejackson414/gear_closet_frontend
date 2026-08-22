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
    const wrapper = await mountSuspended(ForumsWidget, {
      props: {
        loading: false,
        data: {
          latest_posts: forumPosts.latest_posts,
          categories: forumPosts.categories,
        },
      },
    });
    const store = useUserStore();
    store.profile = {
      subscriptions: [{ prices: { identifier: 'MONTHLY' } }],
    } as any;
    await wrapper.vm.$nextTick();

    expect(wrapper.text())
      .toContain('This is a test topic');
    expect(wrapper.text())
      .toContain('General');
    expect(wrapper.text())
      .toContain('topics');
    expect(wrapper.text())
      .toContain('Open forums');
    expect(wrapper.get('a[aria-label="Open General on the forums"]')
      .attributes('href'))
      .toContain('/forums?category=general&categoryId=4');
    expect(wrapper.text())
      .not
      .toContain('Error occurred fetching forum posts.');
  });

  it('renders a paid empty community state with an Open forums CTA', async () => {
    const wrapper = await mountSuspended(ForumsWidget, {
      props: {
        loading: false,
        data: { latest_posts: [], categories: [] },
      },
    });
    const store = useUserStore();
    store.profile = {
      subscriptions: [{ prices: { identifier: 'MONTHLY' } }],
    } as any;
    await wrapper.vm.$nextTick();

    expect(wrapper.text())
      .toContain('The community is warming up');
    expect(wrapper.text())
      .toContain('Open forums');
    expect(wrapper.text())
      .not
      .toContain('Upgrade in Profile');
  });

  it('shows a visible upgrade banner for Free users when posts exist', async () => {
    const wrapper = await mountSuspended(ForumsWidget, {
      props: {
        loading: false,
        data: {
          latest_posts: forumPosts.latest_posts,
          categories: forumPosts.categories,
        },
      },
    });
    const store = useUserStore();
    store.profile = {
      subscriptions: [],
    } as any;
    await wrapper.vm.$nextTick();

    expect(wrapper.text())
      .toContain('Preview only');
    expect(wrapper.text())
      .toContain('Upgrade in Profile');
    expect(wrapper.get('a[aria-label="Upgrade to open General"]')
      .attributes('href'))
      .toContain('/profile?tab=subscription');
  });
});
