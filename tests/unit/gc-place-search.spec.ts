import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GcPlaceSearch from '@/components/common/GcPlaceSearch.vue';
import { testMountGlobals } from './helpers';

const fetchMock = vi.hoisted(() => vi.fn());

mockNuxtImport('$fetch', () => fetchMock);

describe('GcPlaceSearch', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({ attribution: 'Powered by Geoapify', places: [] });
  });

  afterEach(async () => {
    vi.useRealTimers();
    await vi.dynamicImportSettled();
  });

  it('keeps the inline input open after clicking the starting point', async () => {
    const wrapper = await mountSuspended(GcPlaceSearch, {
      global: testMountGlobals(),
      props: {
        modelValue: 'Springer Mountain',
        placeholder: 'Starting point',
        variant: 'inline',
      },
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

  it('does not commit when the inline label is unchanged', async () => {
    const wrapper = await mountSuspended(GcPlaceSearch, {
      global: testMountGlobals(),
      props: {
        modelValue: 'Hannegan Pass',
        placeholder: 'Starting point',
        variant: 'inline',
      },
    });

    vi.useFakeTimers();
    await wrapper.get('[data-testid="place-search-trigger"]')
      .trigger('click');
    await wrapper.vm.$nextTick();

    const input = wrapper.get('input');
    await input.trigger('blur');
    await vi.advanceTimersByTimeAsync(200);

    expect(wrapper.emitted('commit'))
      .toBeUndefined();
  });

  it('commits the typed label when the inline input blurs', async () => {
    const wrapper = await mountSuspended(GcPlaceSearch, {
      global: testMountGlobals(),
      props: {
        modelValue: 'Springer Mountain',
        placeholder: 'Starting point',
        variant: 'inline',
      },
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

  it('fills the field with the short place name when a suggestion is selected', async () => {
    fetchMock.mockResolvedValue({
      attribution: 'Powered by Geoapify',
      places: [{
        label: 'Hannegan Pass, Whatcom, WA',
        lat: 48.88,
        lng: -121.53,
        name: 'Hannegan Pass',
        placeId: 'pass',
      }],
    });

    const wrapper = await mountSuspended(GcPlaceSearch, {
      global: testMountGlobals(),
      props: {
        modelValue: '',
        placeholder: 'Starting point',
        variant: 'inline',
      },
    });

    vi.useFakeTimers();
    await wrapper.get('[data-testid="place-search-trigger"]')
      .trigger('click');
    await wrapper.vm.$nextTick();

    await wrapper.get('input')
      .setValue('Hannegan');
    await vi.advanceTimersByTimeAsync(350);
    await wrapper.vm.$nextTick();

    expect(wrapper.text())
      .toContain('Hannegan Pass, Whatcom, WA');

    await wrapper.get('ul button')
      .trigger('mousedown');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('select')?.[0]?.[0])
      .toMatchObject({ name: 'Hannegan Pass' });
    expect(wrapper.emitted('update:modelValue')
      ?.at(-1))
      .toEqual(['Hannegan Pass']);
    expect(wrapper.text())
      .toContain('Hannegan Pass');
    expect(wrapper.text())
      .not
      .toContain('Whatcom, WA');
  });
});
