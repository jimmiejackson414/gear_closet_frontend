import { describe, expect, it } from 'vitest';
import { SubscriptionLevel } from '@/types';
import {
  isFirstPaidUpgrade,
  subscriptionChangeMethod,
} from '@/utils/subscriptionUpgrade';

describe('subscriptionUpgrade helpers', () => {
  it('treats paid plan without subscription row as first upgrade', () => {
    expect(isFirstPaidUpgrade(SubscriptionLevel.MONTHLY, false))
      .toBe(true);
    expect(subscriptionChangeMethod(SubscriptionLevel.ANNUAL, false))
      .toBe('POST');
  });

  it('uses PUT when a subscription already exists', () => {
    expect(isFirstPaidUpgrade(SubscriptionLevel.MONTHLY, true))
      .toBe(false);
    expect(subscriptionChangeMethod(SubscriptionLevel.MONTHLY, true))
      .toBe('PUT');
  });

  it('does not treat Free or downgrade as first paid upgrade', () => {
    expect(isFirstPaidUpgrade(SubscriptionLevel.FREE, false))
      .toBe(false);
    expect(subscriptionChangeMethod(SubscriptionLevel.FREE, false))
      .toBe('PUT');
  });
});
