import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildImageSrc } from '@/utils/avatar';

const getPublicUrl = vi.hoisted(() => vi.fn((
  path: string,
  options?: { transform?: { width?: number; height?: number } },
) => ({
  data: {
    publicUrl: options?.transform
      ? `https://example.test/render/${path}?width=${options.transform.width}`
      : `https://example.test/object/${path}`,
  },
})));

mockNuxtImport('useSupabaseClient', () => () => ({
  storage: {
    from: () => ({ getPublicUrl }),
  },
}));

describe('buildImageSrc', () => {
  beforeEach(() => {
    getPublicUrl.mockClear();
  });

  it('returns undefined for missing paths', () => {
    expect(buildImageSrc(undefined))
      .toBeUndefined();
    expect(buildImageSrc(null))
      .toBeUndefined();
    expect(buildImageSrc(''))
      .toBeUndefined();
    expect(getPublicUrl)
      .not
      .toHaveBeenCalled();
  });

  it('requests a cover-cropped transform at 2× the CSS size', () => {
    expect(buildImageSrc('user/avatar.jpg', 'sm'))
      .toBe('https://example.test/render/user/avatar.jpg?width=64');
    expect(getPublicUrl)
      .toHaveBeenCalledWith('user/avatar.jpg', {
        transform: {
          width: 64,
          height: 64,
          resize: 'cover',
        },
      });
  });

  it('defaults to md (96px transform)', () => {
    buildImageSrc('user/avatar.jpg');
    expect(getPublicUrl.mock.calls[0]?.[1])
      .toEqual({
        transform: {
          width: 96,
          height: 96,
          resize: 'cover',
        },
      });
  });

  it('can skip the transform for a fallback original', () => {
    expect(buildImageSrc('user/avatar.jpg', 'md', { transform: false }))
      .toBe('https://example.test/object/user/avatar.jpg');
    expect(getPublicUrl)
      .toHaveBeenCalledWith('user/avatar.jpg', undefined);
  });
});
