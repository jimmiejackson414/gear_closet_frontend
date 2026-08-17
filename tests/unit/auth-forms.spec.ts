import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

const signInWithPassword = vi.hoisted(() => vi.fn());
const signUp = vi.hoisted(() => vi.fn());

mockNuxtImport('useSupabaseClient', () => () => ({
  auth: {
    signInWithPassword,
    signUp,
    signInWithOAuth: vi.fn(),
  },
}));

mockNuxtImport('useRequestHeaders', () => () => ({}));

mockNuxtImport('useSupabaseCookieRedirect', () => () => ({
  path: { value: null as string | null },
  pluck: () => null,
}));

describe('Auth forms', () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    signUp.mockReset();
  });

  describe('LoginForm', () => {
    it('renders email, password, and submit controls', async () => {
      const wrapper = await mountSuspended(LoginForm);

      expect(wrapper.find('[data-testid="login-form"]')
        .exists())
        .toBe(true);
      expect(wrapper.find('[data-testid="login-email"]')
        .exists())
        .toBe(true);
      expect(wrapper.find('[data-testid="login-password"]')
        .exists())
        .toBe(true);
      expect(wrapper.find('[data-testid="login-submit"]')
        .exists())
        .toBe(true);
      expect(wrapper.text())
        .toContain('Sign In');
    });

    it('does not call supabase when submitted empty (validation gate)', async () => {
      const wrapper = await mountSuspended(LoginForm);
      await wrapper.find('[data-testid="login-form"]')
        .trigger('submit');
      await flushPromises();

      expect(signInWithPassword)
        .not
        .toHaveBeenCalled();
      expect(wrapper.find('[data-testid="login-error"]')
        .exists())
        .toBe(false);
    });
  });

  describe('RegisterForm', () => {
    it('renders registration fields and submit', async () => {
      const wrapper = await mountSuspended(RegisterForm);

      expect(wrapper.find('[data-testid="register-form"]')
        .exists())
        .toBe(true);
      expect(wrapper.find('[data-testid="register-email"]')
        .exists())
        .toBe(true);
      expect(wrapper.find('[data-testid="register-password"]')
        .exists())
        .toBe(true);
      expect(wrapper.find('[data-testid="register-password-confirm"]')
        .exists())
        .toBe(true);
      expect(wrapper.find('[data-testid="register-submit"]')
        .exists())
        .toBe(true);
      expect(wrapper.text())
        .toContain('Create Account');
    });
  });
});

async function flushPromises () {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}
