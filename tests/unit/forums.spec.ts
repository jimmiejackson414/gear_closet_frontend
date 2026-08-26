import { describe, expect, it } from 'vitest';
import {
  FORUMS_APP_PATH,
  FORUMS_COMING_SOON,
  FORUMS_UPGRADE_PATH,
  forumsAppPath,
  forumsCategoryUrl,
  forumsTopicUrl,
  resolveForumsRedirect,
} from '@/utils/forums';

describe('forums helpers', () => {
  it('builds Discourse topic and category URLs without a trailing slash', () => {
    expect(forumsTopicUrl('http://localhost:3000/', 'welcome'))
      .toBe('http://localhost:3000/t/welcome');
    expect(forumsCategoryUrl('http://localhost:3000/', 'general', 4))
      .toBe('http://localhost:3000/c/general/4');
  });

  it('keeps paid forum entry on the app /forums path', () => {
    expect(forumsAppPath())
      .toBe(FORUMS_APP_PATH);
    expect(forumsAppPath({ topic: 'welcome' }))
      .toBe('/forums?topic=welcome');
    expect(forumsAppPath({ category: 'general', categoryId: 4 }))
      .toBe('/forums?category=general&categoryId=4');
    expect(FORUMS_UPGRADE_PATH)
      .toBe('/profile?tab=subscription');
    expect(FORUMS_COMING_SOON)
      .toBe('Forums (coming soon)');
  });

  it('resolves a Discourse destination from /forums query params', () => {
    expect(resolveForumsRedirect('http://localhost:3000', { topic: 'welcome' }))
      .toBe('http://localhost:3000/t/welcome');
    expect(resolveForumsRedirect('http://localhost:3000', {
      category: 'general',
      categoryId: '4',
    }))
      .toBe('http://localhost:3000/c/general/4');
    expect(resolveForumsRedirect('http://localhost:3000/', {}))
      .toBe('http://localhost:3000');
    expect(resolveForumsRedirect('', { topic: 'welcome' }))
      .toBe('');
  });
});
