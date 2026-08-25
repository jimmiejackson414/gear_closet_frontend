import { describe, expect, it } from 'vitest';
import {
  companionPlaceQueries,
  mapGeoapifyAutocomplete,
  normalizePlaceQuery,
  rankPlaceSuggestions,
} from '@/utils/places';

describe('places', () => {
  it('normalizes query whitespace and case', () => {
    expect(normalizePlaceQuery('  Springer   Mountain '))
      .toBe('springer mountain');
  });

  it('adds a trailhead companion query and drops Pass from Pass Trailhead names', () => {
    expect(companionPlaceQueries('Hannegan Pass'))
      .toEqual(['Hannegan Pass', 'Hannegan Pass trailhead']);
    expect(companionPlaceQueries('Hannegan Pass Trailhead'))
      .toEqual(['Hannegan Pass Trailhead', 'Hannegan Trailhead']);
  });

  it('maps Geoapify autocomplete results and skips incomplete rows', () => {
    expect(mapGeoapifyAutocomplete({
      results: [
        {
          name: 'Hannegan Trailhead',
          county: 'Whatcom County',
          state_code: 'WA',
          formatted: 'Hannegan Trailhead, Forest Road 32, Whatcom County, WA, United States of America',
          lat: 48.9102084,
          lon: -121.5917136,
          place_id: 'abc',
        },
        {
          formatted: 'Springer Mountain, GA, United States',
          lat: 34.6265,
          lon: -84.1938,
          place_id: 'def',
        },
        { formatted: 'Nowhere', lat: Number.NaN, lon: 0 },
        { name: 'Skip me' },
      ],
    }))
      .toEqual([
        {
          label: 'Hannegan Trailhead, Whatcom County, WA',
          lat: 48.9102084,
          lng: -121.5917136,
          placeId: 'abc',
        },
        {
          label: 'Springer Mountain, GA, United States',
          lat: 34.6265,
          lng: -84.1938,
          placeId: 'def',
        },
      ]);
  });

  it('keeps Hannegan matches and prefers the trailhead over other Pass Trailheads', () => {
    expect(rankPlaceSuggestions('Hannegan Pass Trailhead', [
      {
        label: 'Black Bear Pass Trailhead (Northwestern), CO',
        lat: 37.93,
        lng: -107.78,
        placeId: 'co',
      },
      {
        label: 'Hannegan Pass, Whatcom County, WA',
        lat: 48.88,
        lng: -121.53,
        placeId: 'pass',
      },
      {
        label: 'Hannegan Trailhead, Whatcom County, WA',
        lat: 48.91,
        lng: -121.59,
        placeId: 'th',
      },
    ])
      .map(place => place.label))
      .toEqual([
        'Hannegan Trailhead, Whatcom County, WA',
        'Hannegan Pass, Whatcom County, WA',
      ]);
  });
});
