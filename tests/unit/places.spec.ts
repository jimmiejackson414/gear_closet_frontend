import { describe, expect, it } from 'vitest';
import { mapGeoapifyAutocomplete, normalizePlaceQuery } from '@/utils/places';

describe('places', () => {
  it('normalizes query whitespace and case', () => {
    expect(normalizePlaceQuery('  Springer   Mountain '))
      .toBe('springer mountain');
  });

  it('maps Geoapify autocomplete results and skips incomplete rows', () => {
    expect(mapGeoapifyAutocomplete({
      results: [
        {
          formatted: 'Springer Mountain, GA, United States',
          lat: 34.6265,
          lon: -84.1938,
          place_id: 'abc',
        },
        { formatted: 'Nowhere', lat: Number.NaN, lon: 0 },
        { name: 'Skip me' },
      ],
    }))
      .toEqual([
        {
          label: 'Springer Mountain, GA, United States',
          lat: 34.6265,
          lng: -84.1938,
          placeId: 'abc',
        },
      ]);
  });
});
