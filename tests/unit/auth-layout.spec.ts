import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import AuthLayout from '@/layouts/AuthLayout.vue';

describe('AuthLayout', () => {
  it('stacks the form on small screens and hides the 500px logo', async () => {
    const wrapper = await mountSuspended(AuthLayout, {
      slots: { default: '<div data-testid="auth-slot">form</div>' },
    });

    const root = wrapper.find('.min-h-screen');
    expect(root.classes())
      .toContain('flex-col');
    expect(root.classes())
      .toContain('lg:flex-row');

    const desktopLogoWrap = wrapper.find('.hidden.lg\\:flex');
    expect(desktopLogoWrap.exists())
      .toBe(true);

    expect(wrapper.find('[data-testid="auth-slot"]')
      .exists())
      .toBe(true);
  });
});
