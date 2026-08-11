export interface RadarAddress {
  borough: string;
  city: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  county: string;
  distance: number;
  formattedAddress: string;
  geometry: {
    coordinates: [number, number];
    type: string;
  },
  latitude: number;
  layer: string;
  longitude: number;
  neighborhood: string;
  number: string;
  placeLabel: string;
  postalCode: string;
  state: string;
  stateCode: string;
  street: string;
}