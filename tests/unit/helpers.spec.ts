import convert, { type Mass } from 'convert';
import { describe, expect, it } from 'vitest';
import { calculatePackPrices, calculatePackWeights } from '@/utils/helpers';
import type { ExtendedPack } from '@/types/helpers';

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
    id: 1,
    name: 'Test Pack',
    slug: 'test',
    created_at: '',
    updated_at: '',
    profile_id: 'x',
    theme: 'BLUE6',
    private: false,
    allow_comments: true,
    categories: [
      {
        id: 1,
        name: 'Cat',
        unit: 'g',
        slug: 'c',
        pack_id: 1,
        position: 1,
        created_at: '',
        updated_at: '',
        category_items: items.map((item, index) => ({
          id: index + 1,
          category_id: 1,
          item_id: index + 1,
          position: index + 1,
          created_at: '',
          updated_at: '',
          item: {
            id: index + 1,
            name: `Item ${index + 1}`,
            generic_type: '',
            price: item.price ?? 0,
            consumable: item.consumable ?? false,
            worn: item.worn ?? false,
            quantity: item.quantity ?? 1,
            unit: item.unit ?? 'oz',
            weight: item.weight ?? '0',
            url: null,
            slug: `i-${index + 1}`,
            created_at: '',
            updated_at: '',
            profile_id: 'x',
          },
        })),
      },
    ],
  } as ExtendedPack;
}

describe('utils/helpers pack math', () => {
  describe('calculatePackPrices', () => {
    it('returns zeros for empty / missing categories', () => {
      expect(calculatePackPrices(undefined as any))
        .toEqual({ total: 0, base: 0, worn: 0, consumable: 0 });
      expect(calculatePackPrices({ ...packWithItems([]), categories: [] }))
        .toEqual({ total: 0, base: 0, worn: 0, consumable: 0 });
    });

    it('splits base / worn / consumable prices', () => {
      const pack = packWithItems([
        { price: 100, consumable: false, worn: false },
        { price: 50, worn: true, consumable: false },
        { price: 25, consumable: true, worn: false },
        { price: 10, consumable: true, worn: true },
      ]);

      expect(calculatePackPrices(pack))
        .toEqual({
          total: 185,
          base: 100,
          worn: 60, // 50 + 10
          consumable: 35, // 25 + 10
        });
    });
  });

  describe('calculatePackWeights', () => {
    it('converts to mg and applies quantity', () => {
      const pack = packWithItems([
        { weight: '1', unit: 'oz', quantity: 2, consumable: false, worn: false },
        { weight: '10', unit: 'g', quantity: 1, worn: true, consumable: false },
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
        .toEqual({ total: 0, base: 0, worn: 0, consumable: 0 });
    });
  });
});
