import { describe, expect, it } from 'vitest';
import logoColor from '@/utils/logoColor';

describe('logoColor', () => {
  it('returns a dark fill for known dark backgrounds', () => {
    expect(logoColor('gear_closet/auth_pages/background2'))
      .toBe('#4a4a4a');
    expect(logoColor('background13'))
      .toBe('#4a4a4a');
  });

  it('returns white for other backgrounds', () => {
    expect(logoColor('gear_closet/auth_pages/background1'))
      .toBe('#fff');
    expect(logoColor('background14'))
      .toBe('#fff');
  });
});
