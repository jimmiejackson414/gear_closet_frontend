import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FriendsPage from '@/pages/friends.vue';
import {
  createSupabaseMock,
  createThenableQuery,
} from '@/tests/unit/mocks/supabase.mock';
import { testMountGlobals } from './helpers';

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const supabaseUser = vi.hoisted(() => ({
  value: { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' } as { sub: string } | null,
}));

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

mockNuxtImport('useSupabaseUser', () => () => supabaseUser);
mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);

describe('Friends page search', () => {
  beforeEach(() => {
    supabaseUser.value = { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' };
    supabaseClient.current = createSupabaseMock({
      from: () => createThenableQuery({ data: [], error: null }),
      rpc: () => createThenableQuery({ data: [], error: null }),
    });
  });

  it('keeps the find-friends input enabled and mentions email', async () => {
    const wrapper = await mountSuspended(FriendsPage, {
      global: testMountGlobals(),
    });

    const input = wrapper.get('[data-testid="friend-search-input"]');
    expect(input.attributes('placeholder'))
      .toContain('email');
    expect(input.attributes('disabled'))
      .toBeUndefined();
  });
});
