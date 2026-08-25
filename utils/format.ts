import { dinero, toDecimal, type DineroCurrency } from 'dinero.js';
import { USD } from 'dinero.js/currencies';
import { MeasuringSystem, SubscriptionLevel } from '@/types';

/**
 * Capitalizes the first letter of each word in a string.
 */
export const capitalize = (text: string | undefined | null) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0)
      .toUpperCase() + word.slice(1))
    .join(' ');
};

/** User-facing plan name. LIFE would otherwise capitalize to "Life". */
export const subscriptionPlanLabel = (identifier: string | null | undefined) => {
  if (identifier === SubscriptionLevel.LIFE) return 'Lifetime';
  return capitalize(identifier) || 'Free';
};

const isoCurrencies: Record<string, DineroCurrency<number>> = {
  USD,
};

/**
 * Converts a minor-unit amount to a currency format string.
 * @param num - amount in the currency's minor units (e.g. cents)
 * @param currencyCode - ISO 4217 code (default USD)
 */
export const convertCurrency = (
  num: number,
  currencyCode = 'USD',
) => {
  const currency = isoCurrencies[currencyCode] ?? USD;
  const amount = dinero({ amount: Number(num), currency });
  return toDecimal(amount, ({ value, currency: c }) =>
    Number(value)
      .toLocaleString('en-US', {
        style: 'currency',
        currency: c.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }));
};

/**
 * Prepends a protocol to a URL if it is missing.
 */
export const prependProtocol = (url: string) => {
  let u = url;
  const protocolPattern = /^((http|https):\/\/)/;
  const wwwPattern = /^((http|https):\/\/www\.)/;

  if (!protocolPattern.test(u)) {
    u = `https://${u}`;
  }

  if (!wwwPattern.test(u)) {
    const protocol = u.match(protocolPattern);
    if (protocol) {
      u = u.replace(protocolPattern, `${protocol[0]}www.`);
    }
  }

  return u;
};

/**
 * Truncates a string.
 */
export const truncate = (str: string | null | undefined, num = 100) => {
  if (!str) return '';
  return num >= str.length ? str : `${str.substring(0, num)}...`;
};

export const formattedMeasuringSystem = [
  { label: 'Imperial (lbs, oz)', value: MeasuringSystem.IMPERIAL },
  { label: 'Metric (kg, g)', value: MeasuringSystem.METRIC },
];
