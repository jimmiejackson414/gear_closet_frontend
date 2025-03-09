export interface RadarPlace {
  country: string;
  countryCode: string;
  countryFlag: string;
  distance: number;
  formattedAddress: string;
  geometry: {
    coordinates: [number, number];
    type: string;
  };
  id: string;
  latitude: number;
  layer: string;
  longitude: number;
  name: string;
  place_name: string;
  placeLabel: string;
  properties: {
    category: string;
  };
  state: string;
  stateCode: string;
  text: string;
}