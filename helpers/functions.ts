import Dinero from 'dinero.js';
import convert from 'convert';
import type {
  Category,
  CategoryItem,
  Pack,
  User,
} from '@/types';
import type { Currency } from 'dinero.js';
import type { Mass } from 'convert';

interface PackData {
  total: number;
  base: number;
  worn: number;
  consumable: number;
}

interface FriendlyUsernameOptions {
  includeTrailName?: boolean;
}

export const buildImageSrc = (url: string | undefined | null): string | undefined => {
  if (!url) return undefined;
  return `https://res.cloudinary.com/${import.meta.env.NUXT_CLOUDINARY_CLOUD_NAME}/image/upload/${url}`;
};

export const calculateCategoryWeight = (category: Category): number => {
  if (!category || !category.category_items?.length) return 0;

  return (category.category_items as CategoryItem[]).reduce(
    (sum: number, elem: CategoryItem) => {
      const converted = convert(parseFloat(elem.item!.weight || '0'), elem.item!.unit as Mass)
        .to('mg');
      return sum + (converted * (elem.item!.quantity || 0) as number);
    },
    0,
  );
};

export const calculateCategoryPrice = (category: Category): number => {
  if (!category || !category.category_items.length) return 0;
  return category.category_items.reduce((allTotal: number, elem: any) => {
    const sum = elem.item.price * elem.item.quantity;
    return allTotal + sum;
  }, 0);
};

export const calculateCategoryQuantity = (category: Category): number => {
  if (!category || !category.category_items.length) return 0;
  return category.category_items.reduce((allTotal: number, elem: any) => {
    const sum = elem.item.quantity;
    return allTotal + sum;
  }, 0);
};

export const calculatePackPrices = (pack: Pack): PackData => {
  const data = {
    total: 0, base: 0, worn: 0, consumable: 0,
  };

  if (!pack || !pack?.categories?.length) return data;

  pack.categories.forEach(cat => {
    cat?.category_items.forEach(catItem => {
      if (catItem?.item && !catItem.item.consumable && !catItem.item.worn) {
        data.base += catItem.item.price;
      } else if (
        catItem?.item
        && catItem.item.consumable
        && catItem.item.worn
      ) {
        data.worn += catItem.item.price;
        data.consumable += catItem.item.price;
      } else if (catItem?.item && catItem.item.worn) {
        data.worn += catItem.item.price;
      } else if (catItem?.item && catItem.item.consumable) {
        data.consumable += catItem.item.price;
      }

      data.total += catItem?.item ? catItem.item.price : 0;
    });
  });
  return data;
};

export const calculatePackWeights = (pack: Pack): PackData => {
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

  const splitStr = text.toLowerCase()
    .split(' ');

  for (let i = 0; i < splitStr.length; i += 1) {
    splitStr[i] = splitStr[i].charAt(0)
      .toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
};

export const completedOnboarding = (user: User | null | undefined, page: string): boolean => {
  if (!user || !user.onboarding_steps) return false;
  return user.onboarding_steps.some(step => step?.page === page);
};

export const convertCurrency = (
  num: number,
  currency = 'USD' as Currency,
): string => Dinero({ amount: Number(num), currency })
  .toFormat('$0,0.00');

export const getPagination = (page: number, pageSize: number): { from: number, to: number } => {
  const limit = pageSize ? +pageSize : 5;
  const from = page ? page * limit : 0;
  const to = page ? from + pageSize - 1 : pageSize - 1;
  return { from, to };
};

export const initials = (user: User | null | undefined): string => {
  const base = 'GC';
  if (!user) return base;
  const firstInitial = user.first_name?.charAt(0);
  const lastInitial = user.last_name?.charAt(0);
  return firstInitial && lastInitial ? `${firstInitial}${lastInitial}` : base;
};

export const friendlyUsername = (user: User | null | undefined, options?: FriendlyUsernameOptions): string => {
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

export const generateRandomNumber = (max = 5000): number => (Math.random() * max);

export const isValidEmail = (val: string): boolean => {
  const regPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return regPattern.test(val);
};

export const prependProtocol = (url: string): string => {
  let u = url;
  const pattern = /^((http|https):\/\/)/;
  if (!pattern.test(u)) {
    u = `https://${u}`;
  }
  return u;
};

export const truncate = (str: string, num = 100): string => (num > str.length ? str : `${str.substring(0, num)}...`);

export const validateEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);
