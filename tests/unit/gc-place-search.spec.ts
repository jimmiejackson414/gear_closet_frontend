import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GcPlaceSearch from '@/components/common/GcPlaceSearch.vue';
import { testMountGlobals } from './helpers';

const fetchMock = vi.hoisted(() => vi.fn());

mockNuxtImport('$fetch', () => fetchMock);

describe('GcPlaceSearch', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({ places: [], attribution: 'Powered by Geoapify' });
  });

  afterEach(async () => {
    vi.useRealTimers();
    await vi.dynamicImportSettled();
  });

  it('keeps the inline input open after clicking the starting point', async () => {
    const wrapper = await mountSuspended(GcPlaceSearch, {
      props: {
        variant: 'inline',
        modelValue: 'Springer Mountain',
        placeholder: 'Starting point',
      },
      global: testMountGlobals(),
    });

    vi.useFakeTimers();
    await wrapper.get('[data-testid="place-search-trigger"]')
      .trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('input')
      .exists())
      .toBe(true);

    await wrapper.get('[data-testid="place-search"]')
      .trigger('focusout');
    await vi.advanceTimersByTimeAsync(200);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('input')
      .exists())
      .toBe(true);
    expect(wrapper.find('[data-testid="place-search-trigger"]')
      .exists())
      .toBe(false);
  });

  it('commits the typed label when the inline input blurs', async () => {
    const wrapper = await mountSuspended(GcPlaceSearch, {
      props: {
        variant: 'inline',
        modelValue: 'Springer Mountain',
        placeholder: 'Starting point',
      },
      global: testMountGlobals(),
    });

    vi.useFakeTimers();
    await wrapper.get('[data-testid="place-search-trigger"]')
      .trigger('click');
    await wrapper.vm.$nextTick();

    const input = wrapper.get('input');
    await input.setValue('Hannegan Trailhead');
    await input.trigger('blur');
    await vi.advanceTimersByTimeAsync(200);

    expect(wrapper.emitted('commit')?.[0])
      .toEqual(['Hannegan Trailhead']);
  });
});
