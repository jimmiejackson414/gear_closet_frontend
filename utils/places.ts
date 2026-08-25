import type { PlaceSuggestion } from '@/types/places';

type GeoapifyAutocompleteResult = {
  formatted?: string
  address_line1?: string
  city?: string
  county?: string
  state?: string
  state_code?: string
  name?: string
  lat?: number
  lon?: number
  place_id?: string | number
};

export type GeoapifyAutocompleteResponse = {
  results?: GeoapifyAutocompleteResult[]
};

const GENERIC_PLACE_TOKENS = new Set([
  'and',
  'for',
  'forest',
  'lake',
  'mount',
  'mt',
  'near',
  'park',
  'pass',
  'peak',
  'road',
  'the',
  'trail',
  'trailhead',
]);

export function normalizePlaceQuery (value: string): string {
  return value.trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function companionPlaceQueries (raw: string): string[] {
  const text = raw.trim();
  if (!text) return [];

  const seen = new Set<string>();
  const queries: string[] = [];
  const add = (value: string) => {
    const key = normalizePlaceQuery(value);
    if (key.length < 2 || seen.has(key)) return;
    seen.add(key);
    queries.push(value.trim());
  };

  add(text);
  if (!/\btrailheads?\b/i.test(text)) {
    add(`${text} trailhead`);
  } else if (/\bpass\b/i.test(text)) {
    add(text.replace(/\s+pass\b/gi, ''));
  }
  return queries;
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

    const name = result.name || result.address_line1 || null;
    const area = [result.city || result.county, result.state_code || result.state]
      .filter(Boolean)
      .join(', ');
    const label = [name, area].filter(Boolean)
      .join(', ')
      || result.formatted
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

export function rankPlaceSuggestions (
  query: string,
  places: PlaceSuggestion[],
  limit = 8,
): PlaceSuggestion[] {
  const unique = dedupePlaces(places);
  const tokens = placeQueryTokens(query);
  const distinctive = tokens.find(token => !GENERIC_PLACE_TOKENS.has(token)) ?? tokens[0];

  let pool = unique;
  if (distinctive) {
    const matches = unique.filter(place => placeHaystack(place)
      .includes(distinctive));
    if (matches.length) pool = matches;
  }

  return pool
    .map(place => ({ place, score: scorePlace(place, tokens, distinctive) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(entry => entry.place);
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

function placeQueryTokens (query: string): string[] {
  return normalizePlaceQuery(query)
    .split(' ')
    .filter(token => token.length >= 3);
}

function placeHaystack (place: PlaceSuggestion): string {
  return place.label.toLowerCase();
}

function scorePlace (
  place: PlaceSuggestion,
  tokens: string[],
  distinctive: string | undefined,
): number {
  const haystack = placeHaystack(place);
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 2;
  }
  if (distinctive && haystack.startsWith(distinctive)) score += 4;
  if (distinctive && haystack.includes(distinctive)) score += 2;
  if (tokens.includes('trailhead') && haystack.includes('trailhead')) score += 3;
  return score;
}

function dedupePlaces (places: PlaceSuggestion[]): PlaceSuggestion[] {
  const seen = new Set<string>();
  const unique: PlaceSuggestion[] = [];
  for (const place of places) {
    const key = place.placeId || `${place.lat.toFixed(5)},${place.lng.toFixed(5)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(place);
  }
  return unique;
}
