import { describe, expect, it } from 'vitest';
import {
  normalizeCsvConsumable,
  normalizeCsvPriceCents,
  normalizeCsvRow,
  normalizeCsvUnit,
  normalizeCsvWorn,
  prepareCsvRowsForImport,
  validateCsvHeaders,
} from '@/utils/csvImport';

describe('csvImport utils', () => {
  it('maps LighterPack unit names to Gear Closet units', () => {
    expect(normalizeCsvUnit('ounce'))
      .toBe('oz');
    expect(normalizeCsvUnit('pound'))
      .toBe('lb');
    expect(normalizeCsvUnit('grams'))
      .toBe('g');
    expect(normalizeCsvUnit('kilograms'))
      .toBe('kg');
    expect(normalizeCsvUnit(''))
      .toBe('oz');
  });

  it('converts decimal and whole-number prices to cents', () => {
    expect(normalizeCsvPriceCents('29.99'))
      .toBe(2999);
    expect(normalizeCsvPriceCents('$60.00'))
      .toBe(6000);
    expect(normalizeCsvPriceCents('1500'))
      .toBe(1500);
    expect(normalizeCsvPriceCents(''))
      .toBe(0);
  });

  it('normalizes worn and consumable flags from LighterPack values', () => {
    expect(normalizeCsvWorn('Worn'))
      .toBe(true);
    expect(normalizeCsvConsumable('Consumable'))
      .toBe(true);
    expect(normalizeCsvWorn(''))
      .toBe(false);
  });

  it('requires LighterPack header columns', () => {
    expect(validateCsvHeaders(['Item Name', 'Category', 'desc']))
      .toBeNull();
    expect(validateCsvHeaders(['Category', 'desc']))
      .toContain('Item Name');
  });

  it('prepares a LighterPack row for RPC import', () => {
    const rows = prepareCsvRowsForImport([{
      category: 'Kitchen',
      consumable: '',
      desc: 'MSR Pocket Rocket 2',
      item_name: 'Stove',
      price: '29.99',
      qty: 1,
      unit: 'ounce',
      url: '',
      weight: 3.7,
      worn: '',
    }]);

    expect(rows)
      .toEqual([{
        category: 'Kitchen',
        consumable: '',
        desc: 'MSR Pocket Rocket 2',
        item_name: 'Stove',
        price: 2999,
        qty: 1,
        unit: 'oz',
        url: '',
        weight: '3.7',
        worn: '',
      }]);
  });

  it('skips rows without an item name or category', () => {
    expect(normalizeCsvRow({ category: 'Kitchen', item_name: '' }))
      .toBeNull();
    expect(normalizeCsvRow({ category: '', item_name: 'Stove' }))
      .toBeNull();
  });
});
