import { describe, expect, it } from 'vitest';
import {
  FREE_PACK_LIMIT,
  FREE_TRIP_LIMIT,
  isFreeCreateBlocked,
  isResourceLocked,
  needsFreeResourcePick,
  unlockedResources,
} from '@/utils/planLimits';

describe('utils/planLimits', () => {
  it('detects locked resources', () => {
    expect(isResourceLocked({ id: 1, locked_at: null }))
      .toBe(false);
    expect(isResourceLocked({ id: 1, locked_at: '2024-01-01T00:00:00Z' }))
      .toBe(true);
  });

  it('filters unlocked resources', () => {
    const packs = [
      { id: 1, locked_at: null },
      { id: 2, locked_at: '2024-01-01T00:00:00Z' },
    ];
    expect(unlockedResources(packs)
      .map((p) => p.id))
      .toEqual([1]);
  });

  it('requires a Free pick when totals exceed Free quotas', () => {
    expect(needsFreeResourcePick(
      [{ id: 1 }, { id: 2 }],
      [{ id: 1 }],
    ))
      .toBe(true);
    expect(needsFreeResourcePick([{ id: 1 }], [{ id: 1 }]))
      .toBe(false);
    expect(FREE_PACK_LIMIT)
      .toBe(1);
    expect(FREE_TRIP_LIMIT)
      .toBe(1);
  });

  it('blocks Free create based on unlocked count', () => {
    expect(isFreeCreateBlocked(false, [{ id: 1, locked_at: null }], 1))
      .toBe(true);
    expect(isFreeCreateBlocked(false, [
      { id: 1, locked_at: null },
      { id: 2, locked_at: 'x' },
    ], 1))
      .toBe(true);
    expect(isFreeCreateBlocked(false, [], 1))
      .toBe(false);
    expect(isFreeCreateBlocked(true, [{ id: 1 }, { id: 2 }], 1))
      .toBe(false);
  });
});
