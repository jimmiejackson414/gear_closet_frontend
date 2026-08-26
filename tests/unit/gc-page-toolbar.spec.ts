import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it } from 'vitest';
import GcPageToolbar from '@/components/common/GcPageToolbar.vue';
import { testMountGlobals } from './helpers';

describe('GcPageToolbar', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the title and action slot on one toolbar row', async () => {
    const wrapper = await mountSuspended(GcPageToolbar, {
      global: testMountGlobals(),
      props: { title: 'Planning' },
      slots: {
        default: '<button type="button">New Trip</button>',
      },
    });

    expect(wrapper.get('h1')
      .text())
      .toBe('Planning');
    expect(wrapper.text())
      .toContain('New Trip');
    expect(wrapper.get('[data-testid="page-toolbar"]')
      .classes())
      .toEqual(expect.arrayContaining(['flex-wrap']));

    wrapper.unmount();
  });
});
