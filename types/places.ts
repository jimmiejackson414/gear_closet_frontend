export type PlaceSuggestion = {
  label: string
  name?: string
  lat: number
  lng: number
  placeId: string | null
};

export type PlaceSearchResponse = {
  places: PlaceSuggestion[]
  attribution: string
};

export const GEOAPIFY_ATTRIBUTION = 'Powered by Geoapify';
