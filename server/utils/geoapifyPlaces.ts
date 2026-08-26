import { createTtlCache } from '@/server/utils/ttlCache';
import {
  companionPlaceQueries,
  mapGeoapifyAutocomplete,
  normalizePlaceQuery,
  rankPlaceSuggestions,
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

  const batches = await Promise.all(
    companionPlaceQueries(query)
      .map(text => fetchPlaceCandidates(text, apiKey)),
  );
  const places = rankPlaceSuggestions(query, batches.flat());
  if (places.length) {
    placeCache.set(normalized, places);
  }
  return places;
}

async function fetchPlaceCandidates (
  text: string,
  apiKey: string,
): Promise<PlaceSuggestion[]> {
  const cacheKey = `raw:${normalizePlaceQuery(text)}`;
  const cached = placeCache.get(cacheKey);
  if (cached) return cached;

  const autocomplete = await fetchGeoapifyPlaces('autocomplete', text, apiKey);
  const places = autocomplete.length
    ? autocomplete
    : await fetchGeoapifyPlaces('search', text, apiKey);
  if (places.length) {
    placeCache.set(cacheKey, places);
  }
  return places;
}

async function fetchGeoapifyPlaces (
  kind: 'autocomplete' | 'search',
  text: string,
  apiKey: string,
): Promise<PlaceSuggestion[]> {
  const path = kind === 'search'
    ? 'https://api.geoapify.com/v1/geocode/search'
    : 'https://api.geoapify.com/v1/geocode/autocomplete';
  const payload = await $fetch<GeoapifyAutocompleteResponse>(path, {
    headers: { Accept: 'application/json' },
    method: 'GET',
    query: {
      apiKey,
      format: 'json',
      lang: 'en',
      limit: 10,
      text,
    },
    timeout: 8000,
  });
  return mapGeoapifyAutocomplete(payload);
}
