export type WeatherUnits = 'imperial' | 'metric';

export type AirQualityCategory =
  | 'good'
  | 'moderate'
  | 'unhealthy_sensitive'
  | 'unhealthy'
  | 'very_unhealthy'
  | 'hazardous';

export type AirQualitySnapshot = {
  aqi: number
  category: AirQualityCategory
};

export type TripWeatherDay = {
  date: string
  high: number
  low: number
  precipChance: number | null
  weatherCode: number
  airQuality: AirQualitySnapshot | null
};

export type TripWeatherNeedsPlace = {
  status: 'needs_place'
};

export type TripWeatherForecast = {
  status: 'forecast'
  placeLabel: string
  units: WeatherUnits
  days: TripWeatherDay[]
  currentAirQuality: AirQualitySnapshot | null
};

export type TripWeatherTooFar = {
  status: 'too_far'
  availableWithinDays: number
};

export type TripWeatherResponse =
  | TripWeatherNeedsPlace
  | TripWeatherForecast
  | TripWeatherTooFar;

export const OPEN_METEO_ATTRIBUTION = 'Weather and air quality by Open-Meteo.com';
export const FORECAST_HORIZON_DAYS = 16;
export const WEATHER_AVAILABLE_WITHIN_DAYS = 14;
