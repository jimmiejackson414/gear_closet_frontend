import convert from 'convert';
import { ItemUnit, type TablesInsert } from '@/types';
import type { ExtendedCategory, ExtendedPack } from '@/types/closet';
import type { Mass } from 'convert';

/**
 * Sums category item weights in mg, then converts to the requested unit.
 * @param category
 * @param unit Target mass unit (e.g. category.unit or 'lb' for charts)
 * @returns number
 */
export const calculateCategoryWeightInUnit = (category: ExtendedCategory, unit: Mass) => {
  const totalWeightInMg = category.category_items.reduce((total, subRow) => {
    const { item } = subRow;

    // Ensure item has weight, unit, and quantity
    if (item.weight && item.unit && item.quantity) {
      const weightValue = parseFloat(item.weight);

      // If the weight is valid, convert it to mg and add it to the total (multiply by quantity if exists)
      if (!isNaN(weightValue)) {
        const weightInMg = convert(weightValue, item.unit as Mass)
          .to('mg');
        total += weightInMg * item.quantity;
      }
    }

    return total;
  }, 0);

  const convertedTotalWeight = convert(totalWeightInMg, 'mg')
    .to(unit);

  return parseFloat(convertedTotalWeight.toFixed(2));
};

/**
 * Calculates the total weight of a category in the category's unit.
 * @param category
 * @returns number
 */
export const calculateCategoryWeight = (category: ExtendedCategory) =>
  calculateCategoryWeightInUnit(category, category.unit as Mass);

/**
 * Calculates the total price of a category.
 * @param category
 * @returns number
 */
export const calculateCategoryPrice = (category: ExtendedCategory) => {
  if (!category || !category.category_items.length) return 0;
  return category.category_items.reduce((allTotal, elem) => {
    const sum = (elem.item.price ?? 0) * (elem.item.quantity ?? 0);
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
  return category.category_items.reduce((allTotal, elem) => allTotal + (elem.item.quantity ?? 0), 0);
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
 * Generates an array of weight options
 * @param shortLabel - If true, returns the short label (e.g., 'g' instead of 'Grams (g)')
 */
export const weightOptions = ({ shortLabel = false } = {}) =>
  Object.values(ItemUnit)
    .map(value => ({
      value,
      label: shortLabel
        ? value
        : value === ItemUnit.g ? 'Grams (g)' :
          value === ItemUnit.kg ? 'Kilograms (kg)' :
            value === ItemUnit.oz ? 'Ounces (oz)' :
              value === ItemUnit.lb ? 'Pounds (lb)' : value,
    }));
