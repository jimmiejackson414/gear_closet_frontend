import type { Database } from '@/types';

export type ItemUnit = Database['public']['Enums']['item_unit'];

export type CsvImportPayloadRow = {
  category: string
  consumable: string
  desc: string
  item_name: string
  price: number
  qty: number
  unit: ItemUnit
  url: string
  weight: string
  worn: string
};

const UNIT_ALIASES: Record<string, ItemUnit> = {
  g: 'g',
  gram: 'g',
  grams: 'g',
  kg: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',
  lb: 'lb',
  lbs: 'lb',
  ounce: 'oz',
  ounces: 'oz',
  oz: 'oz',
  pound: 'lb',
  pounds: 'lb',
};

export function normalizeCsvUnit (raw: unknown): ItemUnit {
  const key = String(raw ?? '')
    .trim()
    .toLowerCase();
  return UNIT_ALIASES[key] ?? 'oz';
}

export function normalizeCsvPriceCents (raw: unknown): number {
  if (raw == null || raw === '') return 0;

  const text = String(raw)
    .trim()
    .replace(/[$,]/g, '');
  if (!text) return 0;

  if (/^\d+$/.test(text)) {
    return Number(text);
  }

  const value = Number(text);
  if (!Number.isFinite(value)) return 0;

  return Math.round(value * 100);
}

export function normalizeCsvWorn (raw: unknown): boolean {
  const text = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (!text) return false;
  return text === 'worn' || text === 'true' || text === '1' || text === 'yes';
}

export function normalizeCsvConsumable (raw: unknown): boolean {
  const text = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (!text) return false;
  return text === 'consumable' || text === 'true' || text === '1' || text === 'yes';
}

export function normalizeCsvQuantity (raw: unknown): number {
  if (raw == null || raw === '') return 1;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return 1;
  return Math.trunc(value);
}

export function normalizeCsvWeight (raw: unknown): string {
  if (raw == null || raw === '') return '0';
  return String(raw)
    .trim();
}

export function validateCsvHeaders (fields: string[] | undefined): string | null {
  if (!fields?.length) {
    return 'The CSV file must include a header row.';
  }

  const normalized = fields.map(field => field.toLowerCase()
    .trim()
    .replace(/\s/g, '_'));
  if (!normalized.includes('item_name')) {
    return 'Missing required column: Item Name';
  }
  if (!normalized.includes('category')) {
    return 'Missing required column: Category';
  }
  return null;
}

export function normalizeCsvRow (row: Record<string, unknown>): CsvImportPayloadRow | null {
  const itemName = String(row.item_name ?? '')
    .trim();
  const category = String(row.category ?? '')
    .trim();
  if (!itemName || !category) return null;

  const description = row.desc ?? row.description;

  return {
    category,
    consumable: normalizeCsvConsumable(row.consumable) ? 'Consumable' : '',
    desc: description != null ? String(description)
      .trim() : '',
    item_name: itemName,
    price: normalizeCsvPriceCents(row.price),
    qty: normalizeCsvQuantity(row.qty),
    unit: normalizeCsvUnit(row.unit),
    url: row.url != null ? String(row.url)
      .trim() : '',
    weight: normalizeCsvWeight(row.weight),
    worn: normalizeCsvWorn(row.worn) ? 'Worn' : '',
  };
}

export function prepareCsvRowsForImport (rows: Record<string, unknown>[]): CsvImportPayloadRow[] {
  return rows
    .map(normalizeCsvRow)
    .filter((row): row is CsvImportPayloadRow => row != null);
}
