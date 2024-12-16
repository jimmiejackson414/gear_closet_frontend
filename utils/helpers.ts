import convert from 'convert';
import type { Mass } from 'convert';
import Dinero from 'dinero.js';
import type { Currency } from 'dinero.js';
import { v4 as uuidv4 } from 'uuid';
import { type Database, ItemUnit, MeasuringSystem, type Tables, type TablesInsert } from '@/types';
import type { ExtendedCategory, ExtendedCategoryItem, ExtendedPack, ExtendedUser } from '@/types/helpers';

interface FriendlyUsernameOptions {
  includeTrailName?: boolean;
}

/**
 * Builds the image source URL for an avatar.
 * @param url
 * @returns string | undefined
 */
export const buildImageSrc = (url: string | undefined | null) => {
  if (!url) return undefined;
  const supabase = useSupabaseClient<Database>();
  const { data } = supabase.storage.from('avatars')
    .getPublicUrl(url);
  return data?.publicUrl ?? undefined;
};

/**
 * Calculates the total weight of a category.
 * @param category
 * @returns number
 */
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

/**
 * Calculates the total price of a category.
 * @param category
 * @returns number
 */
export const calculateCategoryPrice = (category: ExtendedCategory) => {
  if (!category || !category.category_items.length) return 0;
  return category.category_items.reduce((allTotal: number, elem: any) => {
    const sum = elem.item.price * elem.item.quantity;
    return allTotal + sum;
  }, 0);
};

/**
 * Calculates the total quantity of a category.
 * @param category
 * @returns number
 */
export const calculateCategoryQuantity = (category: ExtendedCategory) => {
  if (!category || !category.category_items.length) return 0;
  return category.category_items.reduce((allTotal: number, elem: any) => {
    const sum = elem.item.quantity;
    return allTotal + sum;
  }, 0);
};

/**
 * Calculates the total prices of a pack.
 * @param pack
 * @returns object
 */
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

/**
 * Calculates the total weights of a pack.
 * @param pack
 * @returns object
 */
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

/**
 * Capitalizes the first letter of each word in a string.
 * @param text
 * @returns string
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

/**
 * Checks if a user has completed onboarding.
 * @param user
 * @param page
 * @returns boolean
 */
export const completedOnboarding = (user: ExtendedUser | null | undefined, page: string) => {
  if (!user || !user.onboarding_steps) return false;
  return user.onboarding_steps.some(step => step?.page === page);
};

/**
 * Converts a number to a currency format.
 * @param num
 * @param currency
 * @returns string
 */
export const convertCurrency = (
  num: number,
  currency = 'USD' as Currency,
) => Dinero({ amount: Number(num), currency })
  .toFormat('$0,0.00');

/**
 * Debounces a function.
 * @param func
 * @param waitFor
 */
export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<F>): ReturnType<F> | void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => func(...args), waitFor);
  };
};

/**
 * Array of formatted measuring systems.
 */
export const formattedMeasuringSystem = [
  { label: 'Imperial (lbs, oz)', value: MeasuringSystem.IMPERIAL },
  { label: 'Metric (kg, g)', value: MeasuringSystem.METRIC },
];

/**
 * Returns a friendly username for a profile.
 * @param user
 * @param options
 * @returns string
 */
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

/**
 * Generates a unique token.
 * @returns string
 */
export const generateUniqueToken = () => uuidv4();

/**
 * Generates a new item.
 * @returns TablesInsert<'items'>
 */
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

/**
 * Generates a random number.
 * @param max
 * @returns number
 */
export const generateRandomNumber = (max = 5000) => (Math.random() * max);

/**
 * Determines the pagination for a list.
 * @param page
 * @param pageSize
 * @returns object
 */
export const getPagination = (page: number, pageSize: number): { from: number, to: number } => {
  const limit = pageSize ? +pageSize : 5;
  const from = page ? page * limit : 0;
  const to = page ? from + pageSize - 1 : pageSize - 1;
  return { from, to };
};

/**
 * Converts a CSS HSL variable to a HEX color code.
 * @param hslVar - The CSS variable value (e.g., 'hsl(var(--text))').
 * @returns The HEX color code.
 */
export const hslVarToHex = async (hslVar: string): Promise<string> => {
  // Ensure the code runs only on the client side
  if (typeof window === 'undefined' || !document.documentElement) {
    console.warn(`hslVarToHex: Attempted to resolve '${hslVar}' on the server.`);
    return '#000000'; // Fallback to black
  }

  // Extract the CSS variable name from the HSL string
  const varNameMatch = hslVar.match(/var\((--[^)]+)\)/);
  if (!varNameMatch) {
    console.error(`hslVarToHex: Invalid CSS variable format in '${hslVar}'`);
    return '#000000'; // Fallback to black
  }
  const varName = varNameMatch[1];

  // Add a slight delay and use nextTick to ensure styles are updated
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 100));

  // Get the computed HSL value from the CSS variable
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const hslValue = computedStyle.getPropertyValue(varName)
    ?.trim();

  // Handle undefined or empty HSL values
  if (!hslValue) {
    console.warn(`hslVarToHex: Variable '${varName}' is not defined in styles.`);
    return '#000000'; // Fallback to black
  }

  // Match the HSL values
  const hslMatch = hslValue.match(/\d+/g);
  if (!hslMatch || hslMatch.length < 3) {
    console.error(`hslVarToHex: Invalid HSL value for '${varName}': '${hslValue}'`);
    return '#000000'; // Fallback to black
  }

  const [h, s, l] = hslMatch.map(Number);

  // Convert the HSL values to HEX
  const lightness = l / 100;
  const a = s * Math.min(lightness, 1 - lightness) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // Convert to hex and pad with zeroes
  };

  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Returns the initials of a user.
 * @param user
 * @returns string
 */
export const initials = (user: Tables<'profiles'>| null | undefined) => {
  const base = 'GC';
  if (!user) return base;
  const firstInitial = user.first_name?.charAt(0);
  const lastInitial = user.last_name?.charAt(0);
  return firstInitial && lastInitial ? `${firstInitial}${lastInitial}` : base;
};

/**
 * Checks for a valid email
 * @param val
 * @returns boolean
 */
export const isValidEmail = (val: string) => {
  const regPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return regPattern.test(val);
};

/**
  * Prepends a protocol to a URL if it is missing.
 * @param url
 * @returns string
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
 * @param str
 * @param num
 * @returns string
 */
export const truncate = (str: string | null | undefined, num = 100) => {
  if (!str) return '';
  return num >= str.length ? str : `${str.substring(0, num)}...`;
};

/**
 * Generates an array of weight options
 * @param shortLabel - If true, returns the short label (e.g., 'g' instead of 'Grams (g)')
 */
export const weightOptions = ({ shortLabel = false } = {}) =>
  Object.values(ItemUnit)
    .map(value => ({
      value,
      label: shortLabel
        ? value // If shortLabel is true, return the enum value itself (e.g., 'g')
        : value === ItemUnit.g ? 'Grams (g)' :
          value === ItemUnit.kg ? 'Kilograms (kg)' :
            value === ItemUnit.oz ? 'Ounces (oz)' :
              value === ItemUnit.lb ? 'Pounds (lb)' : value,
    }));

/**
 * Validates an email address.
 * @param email
 * @returns boolean
 */
export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);