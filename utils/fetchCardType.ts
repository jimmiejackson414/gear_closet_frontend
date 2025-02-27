export const fetchCardType = (card: string | null | undefined): string => {
  switch (card) {
  case 'amex':
    return '/images/financial/amex.svg';
  case 'diners':
    return '/images/financial/diners.svg';
  case 'discover':
    return '/images/financial/discover.svg';
  case 'jcb':
    return '/images/financial/jcb.svg';
  case 'mastercard':
    return '/images/financial/mastercard.svg';
  case 'unionpay':
    return '/images/financial/unionpay.svg';
  case 'visa':
    return '/images/financial/visa.svg';
  default:
    return '/images/financial/unknown.svg';
  }
};
