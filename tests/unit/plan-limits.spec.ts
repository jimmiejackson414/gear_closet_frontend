import { describe, expect, it } from 'vitest';
import { SubscriptionLevel } from '@/types';
import {
  FREE_PACK_LIMIT,
  FREE_TRIP_LIMIT,
  isFreeCreateBlocked,
  isPaidPlanIdentifier,
  isResourceLocked,
  LOCKED_DEEPLINK_CTA,
  lockedDeepLinkMessage,
  needsFreeResourcePick,
  resolveLockedFallback,
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

  it('treats Monthly, Annual, and Lifetime as paid plans', () => {
    expect(isPaidPlanIdentifier(SubscriptionLevel.FREE))
      .toBe(false);
    expect(isPaidPlanIdentifier(undefined))
      .toBe(false);
    expect(isPaidPlanIdentifier(SubscriptionLevel.MONTHLY))
      .toBe(true);
    expect(isPaidPlanIdentifier(SubscriptionLevel.ANNUAL))
      .toBe(true);
    expect(isPaidPlanIdentifier(SubscriptionLevel.LIFE))
      .toBe(true);
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

  it('resolves a locked deep-link fallback to the first unlocked resource', () => {
    const locked = { id: 1, locked_at: '2026-01-01T00:00:00Z' };
    const unlocked = { id: 2, locked_at: null };
    const packs = [locked, unlocked];
    expect(resolveLockedFallback(locked, packs, isResourceLocked))
      .toEqual({ needed: true, unlocked });
    expect(resolveLockedFallback(unlocked, packs, isResourceLocked))
      .toEqual({ needed: false });
    expect(resolveLockedFallback(locked, [locked], isResourceLocked))
      .toEqual({ needed: true, unlocked: undefined });
  });

  it('explains locked pack and trip deep links', () => {
    expect(lockedDeepLinkMessage('pack'))
      .toContain('pack is locked');
    expect(lockedDeepLinkMessage('trip'))
      .toContain('trip is locked');
    expect(LOCKED_DEEPLINK_CTA)
      .toContain('Free selection');
  });
});
