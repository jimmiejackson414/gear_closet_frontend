import dinero from 'dinero.js';
import { SubscriptionLevel } from '@/types';

export interface Tier {
  borderColor: string;
  buttonDisabled: boolean;
  buttonText: string;
  description: string[];
  price: string;
  priceSubtitle: string;
  subheader?: string;
  title: string;
  value: SubscriptionLevel;
}

const tiers: Tier[] = [
  {
    borderColor: tailwind.theme.colors.warning,
    buttonDisabled: false,
    buttonText: 'Select',
    description: [
      '1 Pack',
      '1 Trip',
      'Email Support',
    ],
    price: dinero({ amount: 0, currency: 'USD' })
      .toFormat('$0,0.00'),
    priceSubtitle: 'for forever',
    title: 'Free',
    value: SubscriptionLevel.FREE,
  },
  {
    borderColor: tailwind.theme.colors.primary.DEFAULT,
    buttonDisabled: false,
    buttonText: 'Select',
    description: [
      'Unlimited Packs',
      'Unlimited Trips',
      'Forum Access',
      'Email Support',
      '20% discount',
    ],
    price: dinero({ amount: 1899, currency: 'USD' })
      .toFormat('$0,0.00'),
    priceSubtitle: 'per year',
    subheader: 'Most popular',
    title: 'Annual',
    value: SubscriptionLevel.ANNUAL,
  },
  {
    borderColor: tailwind.theme.colors.positive,
    buttonDisabled: false,
    buttonText: 'Select',
    description: [
      'Unlimited Packs',
      'Unlimited Trips',
      'Forum Access',
      'Email Support',
    ],
    price: dinero({ amount: 199, currency: 'USD' })
      .toFormat('$0,0.00'),
    priceSubtitle: 'per month',
    title: 'Monthly',
    value: SubscriptionLevel.MONTHLY,
  },
];

export default tiers;
