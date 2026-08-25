import { createTtlCache } from '@/server/utils/ttlCache';
import {
  mapGeoapifyAutocomplete,
  normalizePlaceQuery,
  type GeoapifyAutocompleteResponse,
} from '@/utils/places';
import type { PlaceSuggestion } from '@/types/places';

const placeCache = createTtlCache<PlaceSuggestion[]>(30 * 24 * 60 * 60 * 1000);

export async function searchPlaces (
  query: string,
  apiKey: string,
): Promise<PlaceSuggestion[]> {
  const normalized = normalizePlaceQuery(query);
  if (normalized.length < 2 || !apiKey) return [];

  const cached = placeCache.get(normalized);
  if (cached) return cached;

  const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete');
  url.searchParams.set('text', query.trim());
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '6');
  url.searchParams.set('lang', 'en');
  url.searchParams.set('apiKey', apiKey);

  const payload = await $fetch<GeoapifyAutocompleteResponse>(url.toString(), {
    method: 'GET',
    timeout: 8000,
  });

  const places = mapGeoapifyAutocomplete(payload);
  placeCache.set(normalized, places);
  return places;
}
