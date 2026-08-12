import { convertCurrency } from '@/utils/helpers';
import { SubscriptionLevel } from '@/types';

export interface Tier {
  title: string;
  subheader?: string;
  price: string;
  priceSubtitle: string;
  description: string[];
  borderColor: string;
  buttonText: string;
  buttonDisabled: boolean;
  value: SubscriptionLevel;
}

const tiers: Tier[] = [
  {
    title: 'Free',
    price: convertCurrency(0),
    priceSubtitle: 'for forever',
    description: [
      '1 Pack',
      '1 Trip',
      'Email Support',
    ],
    borderColor: tailwind.theme.colors.warning,
    buttonText: 'Select',
    buttonDisabled: false,
    value: SubscriptionLevel.FREE,
  },
  {
    title: 'Annual',
    subheader: 'Most popular',
    price: convertCurrency(1899),
    priceSubtitle: 'per year',
    description: [
      'Unlimited Packs',
      'Unlimited Trips',
      'Forum Access',
      'Email Support',
      '20% discount',
    ],
    borderColor: tailwind.theme.colors.primary.DEFAULT,
    buttonText: 'Select',
    buttonDisabled: false,
    value: SubscriptionLevel.ANNUAL,
  },
  {
    title: 'Monthly',
    price: convertCurrency(199),
    priceSubtitle: 'per month',
    description: [
      'Unlimited Packs',
      'Unlimited Trips',
      'Forum Access',
      'Email Support',
    ],
    borderColor: tailwind.theme.colors.positive,
    buttonText: 'Select',
    buttonDisabled: false,
    value: SubscriptionLevel.MONTHLY,
  },
];

export default tiers;
