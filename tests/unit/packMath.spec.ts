import convert, { type Mass } from 'convert';
import { describe, expect, it } from 'vitest';
import { calculatePackPrices, calculatePackWeights } from '@/utils/packMath';
import type { ExtendedPack } from '@/types/closet';

function packWithItems (
  items: Array<{
    price?: number;
    weight?: string;
    unit?: string;
    quantity?: number;
    consumable?: boolean | null;
    worn?: boolean | null;
  }>,
): ExtendedPack {
  return {
    allow_comments: true,
    categories: [
      {
        category_items: items.map((item, index) => ({
          category_id: 1,
          created_at: '',
          id: index + 1,
          item: {
            consumable: item.consumable ?? false,
            created_at: '',
            generic_type: '',
            id: index + 1,
            name: `Item ${index + 1}`,
            price: item.price ?? 0,
            profile_id: 'x',
            quantity: item.quantity ?? 1,
            slug: `i-${index + 1}`,
            unit: item.unit ?? 'oz',
            updated_at: '',
            url: null,
            weight: item.weight ?? '0',
            worn: item.worn ?? false,
          },
          item_id: index + 1,
          position: index + 1,
          updated_at: '',
        })),
        created_at: '',
        id: 1,
        name: 'Cat',
        pack_id: 1,
        position: 1,
        slug: 'c',
        unit: 'g',
        updated_at: '',
      },
    ],
    created_at: '',
    id: 1,
    name: 'Test Pack',
    private: false,
    profile_id: 'x',
    slug: 'test',
    theme: 'BLUE6',
    updated_at: '',
  } as ExtendedPack;
}

describe('utils/packMath', () => {
  describe('calculatePackPrices', () => {
    it('returns zeros for empty / missing categories', () => {
      expect(calculatePackPrices(undefined as any))
        .toEqual({ base: 0, consumable: 0, total: 0, worn: 0 });
      expect(calculatePackPrices({ ...packWithItems([]), categories: [] }))
        .toEqual({ base: 0, consumable: 0, total: 0, worn: 0 });
    });

    it('splits base / worn / consumable prices', () => {
      const pack = packWithItems([
        { consumable: false, price: 100, worn: false },
        { consumable: false, price: 50, worn: true },
        { consumable: true, price: 25, worn: false },
        { consumable: true, price: 10, worn: true },
      ]);

      expect(calculatePackPrices(pack))
        .toEqual({
          base: 100,
          consumable: 35, // 25 + 10
          total: 185,
          worn: 60, // 50 + 10
        });
    });
  });

  describe('calculatePackWeights', () => {
    it('converts to mg and applies quantity', () => {
      const pack = packWithItems([
        { consumable: false, quantity: 2, unit: 'oz', weight: '1', worn: false },
        { consumable: false, quantity: 1, unit: 'g', weight: '10', worn: true },
      ]);

      const ozMg = convert(1, 'oz' as Mass)
        .to('mg');
      const gMg = convert(10, 'g' as Mass)
        .to('mg');

      const weights = calculatePackWeights(pack);
      expect(weights.base)
        .toBe(ozMg * 2);
      expect(weights.worn)
        .toBe(gMg);
      expect(weights.consumable)
        .toBe(0);
      expect(weights.total)
        .toBe(ozMg * 2 + gMg);
    });

    it('handles empty pack without throwing', () => {
      expect(calculatePackWeights({ ...packWithItems([]), categories: [] }))
        .toEqual({ base: 0, consumable: 0, total: 0, worn: 0 });
    });
  });
});
