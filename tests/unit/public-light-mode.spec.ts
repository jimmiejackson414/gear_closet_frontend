import { describe, expect, it } from 'vitest';
import publicLightMode from '@/middleware/public-light-mode.global';

type MiddlewareTo = Parameters<typeof publicLightMode>[0];
type MiddlewareFrom = Parameters<typeof publicLightMode>[1];

function routeStub (layout: string): MiddlewareTo {
  return { meta: { layout } } as unknown as MiddlewareTo;
}

describe('middleware/public-light-mode', () => {
  it('forces light color mode on public-layout routes', () => {
    const to = routeStub('public-layout');

    publicLightMode(to, {} as MiddlewareFrom);

    expect(to.meta.colorMode)
      .toBe('light');
  });

  it('forces light color mode on auth-layout routes', () => {
    const to = routeStub('auth-layout');

    publicLightMode(to, {} as MiddlewareFrom);

    expect(to.meta.colorMode)
      .toBe('light');
  });

  it('does not override color mode on other layouts', () => {
    const to = routeStub('default');

    publicLightMode(to, {} as MiddlewareFrom);

    expect(to.meta.colorMode)
      .toBeUndefined();
  });
});
