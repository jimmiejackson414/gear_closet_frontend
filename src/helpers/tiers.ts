import dinero from 'dinero.js';
import { SubscriptionLevel } from '@/generated/types';
import tailwind from '@/helpers/tailwind';

export interface Tier {
  title: string;
  subheader?: string;
  price: string;
  priceSubtitle: string;
  description: string[];
  borderColor: string;
  buttonText: string;
  buttonVariant: string;
  buttonDisabled: boolean;
  value: SubscriptionLevel;
}

const tiers: Tier[] = [
  {
    title: 'Free',
    price: dinero({ amount: 0, currency: 'USD' })
      .toFormat('$0,0.00'),
    priceSubtitle: 'free forever',
    description: [
      '1 Pack',
      '1 Trip',
      'Email Support',
    ],
    borderColor: '#e0e0e0',
    buttonText: 'Continue for free',
    buttonVariant: 'outlined',
    buttonDisabled: false,
    value: SubscriptionLevel.Free,
  },
  {
    title: 'Annual',
    subheader: 'Most popular',
    price: dinero({ amount: 1899, currency: 'USD' })
      .toFormat('$0,0.00'),
    priceSubtitle: 'per year',
    description: [
      'Unlimited Packs',
      'Unlimited Trips',
      'Forum Access',
      'Email Support',
      '20% discount',
    ],
    borderColor: tailwind.theme.colors.primary,
    buttonText: 'Coming soon!',
    buttonVariant: 'unelevated',
    buttonDisabled: true,
    value: SubscriptionLevel.Annual,
  },
  {
    title: 'Monthly',
    price: dinero({ amount: 199, currency: 'USD' })
      .toFormat('$0,0.00'),
    priceSubtitle: 'per month',
    description: [
      'Unlimited Packs',
      'Unlimited Trips',
      'Forum Access',
      'Email Support',
    ],
    borderColor: tailwind.theme.colors.positive,
    buttonText: 'Coming soon!',
    buttonVariant: 'outlined',
    buttonDisabled: true,
    value: SubscriptionLevel.Monthly,
  },
];

export default tiers;
