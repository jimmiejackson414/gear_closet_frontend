import type { PlaceSuggestion } from '@/types/places';

type GeoapifyAutocompleteResult = {
  formatted?: string
  address_line1?: string
  city?: string
  name?: string
  lat?: number
  lon?: number
  place_id?: string | number
};

export type GeoapifyAutocompleteResponse = {
  results?: GeoapifyAutocompleteResult[]
};

export function normalizePlaceQuery (value: string): string {
  return value.trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function mapGeoapifyAutocomplete (
  payload: GeoapifyAutocompleteResponse | null | undefined,
): PlaceSuggestion[] {
  const results = payload?.results;
  if (!Array.isArray(results)) return [];

  const places: PlaceSuggestion[] = [];
  for (const result of results) {
    const lat = result.lat;
    const lng = result.lon;
    if (typeof lat !== 'number' || typeof lng !== 'number') continue;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const label = result.formatted
      || [result.name || result.address_line1, result.city].filter(Boolean)
        .join(', ')
      || null;
    if (!label) continue;

    places.push({
      label,
      lat,
      lng,
      placeId: result.place_id == null ? null : String(result.place_id),
    });
  }

  return places;
}

export function coordsFromPlace (place: PlaceSuggestion | null): {
  lat: number | null
  lng: number | null
  placeId: string | null
} {
  if (!place) {
    return { lat: null, lng: null, placeId: null };
  }
  return { lat: place.lat, lng: place.lng, placeId: place.placeId };
}
