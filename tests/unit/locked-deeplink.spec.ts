import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import LockedDeepLinkBanner from '@/components/common/LockedDeepLinkBanner.vue';
import { LOCKED_DEEPLINK_CTA, lockedDeepLinkMessage } from '@/utils/planLimits';
import { testMountGlobals } from './helpers';

describe('LockedDeepLinkBanner', () => {
  it('explains the locked pack deep link and links to profile', async () => {
    const wrapper = await mountSuspended(LockedDeepLinkBanner, {
      global: testMountGlobals(),
      props: { kind: 'pack' },
    });

    expect(wrapper.get('[data-testid="locked-deeplink-banner"]')
      .text())
      .toContain(lockedDeepLinkMessage('pack'));
    expect(wrapper.text())
      .toContain(LOCKED_DEEPLINK_CTA);

    const profileLink = wrapper.findComponent({ name: 'NuxtLink' });
    expect(profileLink.props('to'))
      .toEqual({ name: 'profile' });
  });

  it('emits dismiss', async () => {
    const wrapper = await mountSuspended(LockedDeepLinkBanner, {
      global: testMountGlobals(),
      props: { kind: 'trip' },
    });

    const dismiss = wrapper.findAllComponents({ name: 'Button' })
      .find((button) => button.text()
        .includes('Dismiss'));
    await dismiss!.trigger('click');

    expect(wrapper.emitted('dismiss'))
      .toBeTruthy();
  });
});
