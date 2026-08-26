import { SubscriptionLevel } from '@/types';
import { convertCurrency } from '@/utils/format';

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
    borderColor: tailwind.theme.colors.warning,
    buttonDisabled: false,
    buttonText: 'Select',
    description: [
      '1 Pack',
      '1 Trip',
      'Email Support',
    ],
    price: convertCurrency(0),
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
    price: convertCurrency(1899),
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
    price: convertCurrency(199),
    priceSubtitle: 'per month',
    title: 'Monthly',
    value: SubscriptionLevel.MONTHLY,
  },
];

export default tiers;
