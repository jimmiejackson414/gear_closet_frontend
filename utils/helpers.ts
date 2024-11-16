import convert from 'convert';
import Dinero from 'dinero.js';
import { v4 as uuidv4 } from 'uuid';
import type { ExtendedCategory, ExtendedCategoryItem, ExtendedPack, ExtendedUser } from '@/types/helpers';
import type { Mass } from 'convert';
import type { Currency } from 'dinero.js';
import { MeasuringSystem, type Database, type Tables, type TablesInsert } from '@/types';

interface FriendlyUsernameOptions {
  includeTrailName?: boolean;
}

export const buildImageSrc = (url: string | undefined | null) => {
  if (!url) return undefined;
  const supabase = useSupabaseClient<Database>();
  const { data } = supabase.storage.from('avatars')
    .getPublicUrl(url);
  return data?.publicUrl ?? undefined;
};

export const calculateCategoryWeight = (category: ExtendedCategory) => {
  if (!category || !category.category_items?.length) return 0;

  return (category.category_items).reduce(
    (sum: number, elem: ExtendedCategoryItem) => {
      const converted = convert(parseFloat(elem.item!.weight || '0'), elem.item!.unit as Mass)
        .to('mg');
      return sum + (converted * (elem.item!.quantity || 0) as number);
    },
    0,
  );
};

export const calculateCategoryPrice = (category: ExtendedCategory) => {
  if (!category || !category.category_items.length) return 0;
  return category.category_items.reduce((allTotal: number, elem: any) => {
    const sum = elem.item.price * elem.item.quantity;
    return allTotal + sum;
  }, 0);
};

export const calculateCategoryQuantity = (category: ExtendedCategory) => {
  if (!category || !category.category_items.length) return 0;
  return category.category_items.reduce((allTotal: number, elem: any) => {
    const sum = elem.item.quantity;
    return allTotal + sum;
  }, 0);
};

export const calculatePackPrices = (pack: ExtendedPack) => {
  const data = {
    total: 0, base: 0, worn: 0, consumable: 0,
  };

  if (!pack || !pack?.categories?.length) return data;

  pack.categories.forEach(cat => {
    cat?.category_items.forEach(catItem => {
      if (catItem?.item && !catItem.item.consumable && !catItem.item.worn) {
        data.base += catItem.item.price || 0;
      } else if (
        catItem?.item
        && catItem.item.consumable
        && catItem.item.worn
      ) {
        data.worn += catItem.item.price || 0;
        data.consumable += catItem.item.price || 0;
      } else if (catItem?.item && catItem.item.worn) {
        data.worn += catItem.item.price || 0;
      } else if (catItem?.item && catItem.item.consumable) {
        data.consumable += catItem.item.price || 0;
      }

      data.total += catItem.item.price || 0;
    });
  });
  return data;
};

export const calculatePackWeights = (pack: ExtendedPack) => {
  const data = {
    total: 0, base: 0, worn: 0, consumable: 0,
  };

  pack?.categories?.forEach(cat => {
    cat?.category_items.forEach(catItem => {
      let converted = 0;
      if (catItem?.item) {
        converted = convert(parseFloat(catItem.item.weight || '0'), catItem.item.unit as Mass)
          .to('mg');
      }

      if (
        catItem?.item?.quantity
          && !catItem.item.consumable
          && !catItem.item.worn
      ) {
        data.base += converted * catItem.item.quantity;
      } else if (
        catItem?.item?.quantity
          && catItem
          && catItem.item.consumable
          && catItem.item.worn
      ) {
        data.worn += converted * catItem.item.quantity;
        data.consumable += converted * catItem.item.quantity;
      } else if (catItem?.item?.quantity && catItem.item.worn) {
        data.worn += converted * catItem.item.quantity;
      } else if (catItem?.item?.quantity && catItem.item.consumable) {
        data.consumable += converted * catItem.item.quantity;
      }

      data.total += catItem?.item
        ? converted * (catItem?.item?.quantity ?? 0)
        : 0;
    });
  });
  return data;
};

export const capitalize = (text: string | undefined | null): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0)
      .toUpperCase() + word.slice(1))
    .join(' ');
};

export const completedOnboarding = (user: ExtendedUser | null | undefined, page: string) => {
  if (!user || !user.onboarding_steps) return false;
  return user.onboarding_steps.some(step => step?.page === page);
};

export const convertCurrency = (
  num: number,
  currency = 'USD' as Currency,
) => Dinero({ amount: Number(num), currency })
  .toFormat('$0,0.00');

export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<F>): ReturnType<F> | void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => func(...args), waitFor);
  };
};

export const formattedMeasuringSystem = [
  { label: 'Imperial (lbs, oz)', value: MeasuringSystem.IMPERIAL },
  { label: 'Metric (kg, g)', value: MeasuringSystem.METRIC },
];

export const friendlyUsername = (user: Tables<'profiles'> | null | undefined, options?: FriendlyUsernameOptions) => {
  if (!user) return initials(user);
  if (options?.includeTrailName && user.trail_name) {
    return `${user.first_name} "${user.trail_name}" ${user.last_name}`;
  }
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name && !user.last_name) return user.first_name;
  return user.email;
};

export const generateUniqueToken = () => uuidv4();

export const generateItem = (): TablesInsert<'items'> => ({
  consumable: false,
  generic_type: '',
  name: '',
  price: 0,
  quantity: 0,
  slug: '',
  unit: 'oz',
  url: '',
  weight: '0',
  worn: false,
});

export const generateRandomNumber = (max = 5000) => (Math.random() * max);

export const getPagination = (page: number, pageSize: number): { from: number, to: number } => {
  const limit = pageSize ? +pageSize : 5;
  const from = page ? page * limit : 0;
  const to = page ? from + pageSize - 1 : pageSize - 1;
  return { from, to };
};

export const initials = (user: Tables<'profiles'>| null | undefined) => {
  const base = 'GC';
  if (!user) return base;
  const firstInitial = user.first_name?.charAt(0);
  const lastInitial = user.last_name?.charAt(0);
  return firstInitial && lastInitial ? `${firstInitial}${lastInitial}` : base;
};

export const isValidEmail = (val: string) => {
  const regPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return regPattern.test(val);
};

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

export const truncate = (str: string | null | undefined, num = 100) => {
  if (!str) return '';
  return num >= str.length ? str : `${str.substring(0, num)}...`;
};

export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);