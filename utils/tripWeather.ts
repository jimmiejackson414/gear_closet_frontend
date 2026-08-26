import {
  FORECAST_HORIZON_DAYS,
  WEATHER_AVAILABLE_WITHIN_DAYS,
  type AirQualityCategory,
  type AirQualitySnapshot,
} from '@/types/weather';

export type WeatherIconKind =
  | 'sun'
  | 'cloud'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'thunder';

export function weatherUnitsFromMeasuringSystem (
  system: string | null | undefined,
): 'imperial' | 'metric' {
  return system === 'METRIC' ? 'metric' : 'imperial';
}

export function hasTripStartDate (
  startingDateIso: string | null | undefined,
): startingDateIso is string {
  if (!startingDateIso) return false;
  const start = new Date(startingDateIso);
  return !Number.isNaN(start.getTime());
}

export function shouldUseForecast (
  startingDateIso: string | null | undefined,
  now = new Date(),
): boolean {
  if (!hasTripStartDate(startingDateIso)) return false;
  const start = new Date(startingDateIso);
  const horizon = new Date(now);
  horizon.setUTCDate(horizon.getUTCDate() + WEATHER_AVAILABLE_WITHIN_DAYS);
  return start.getTime() <= horizon.getTime();
}

export function clampForecastRange (
  startingDateIso: string | null | undefined,
  endingDateIso: string | null | undefined,
  now = new Date(),
): { start: string; end: string } {
  const today = toIsoDate(now);
  const horizon = new Date(now);
  horizon.setUTCDate(horizon.getUTCDate() + FORECAST_HORIZON_DAYS);
  const horizonDate = toIsoDate(horizon);

  const tripStart = startingDateIso ? toIsoDate(new Date(startingDateIso)) : today;
  const tripEnd = endingDateIso ? toIsoDate(new Date(endingDateIso)) : tripStart;

  const start = tripStart < today ? today : tripStart;
  const end = tripEnd > horizonDate ? horizonDate : tripEnd;
  return {
    start,
    end: end < start ? start : end,
  };
}

export function weatherIconKind (code: number): WeatherIconKind {
  if (code === 0 || code === 1) return 'sun';
  if (code === 2 || code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95) return 'thunder';
  if (code >= 51) return 'rain';
  return 'cloud';
}

export function usAqiCategory (aqi: number): AirQualityCategory {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy_sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very_unhealthy';
  return 'hazardous';
}

export function airQualitySnapshot (aqi: number | null | undefined): AirQualitySnapshot | null {
  if (typeof aqi !== 'number' || !Number.isFinite(aqi)) return null;
  const rounded = Math.round(aqi);
  return { aqi: rounded, category: usAqiCategory(rounded) };
}

export function dailyMaxAqi (
  times: string[],
  values: Array<number | null | undefined>,
): Record<string, AirQualitySnapshot> {
  const maxByDate = new Map<string, number>();
  times.forEach((time, index) => {
    const value = values[index];
    if (typeof value !== 'number' || !Number.isFinite(value)) return;
    const date = time.slice(0, 10);
    const current = maxByDate.get(date);
    if (current == null || value > current) {
      maxByDate.set(date, value);
    }
  });

  const snapshots: Record<string, AirQualitySnapshot> = {};
  maxByDate.forEach((aqi, date) => {
    const snapshot = airQualitySnapshot(aqi);
    if (snapshot) snapshots[date] = snapshot;
  });
  return snapshots;
}

export function airQualityLabel (category: AirQualityCategory): string {
  switch (category) {
    case 'good':
      return 'Good';
    case 'moderate':
      return 'Moderate';
    case 'unhealthy_sensitive':
      return 'Unhealthy for sensitive groups';
    case 'unhealthy':
      return 'Unhealthy';
    case 'very_unhealthy':
      return 'Very unhealthy';
    case 'hazardous':
      return 'Hazardous';
  }
}

export function toIsoDate (date: Date): string {
  return date.toISOString()
    .slice(0, 10);
}

type TripWeatherPlaceFields = {
  origin_lat?: number | null
  origin_lng?: number | null
  starting_point?: string | null
  destination_lat?: number | null
  destination_lng?: number | null
  ending_point?: string | null
  starting_date?: string | null
  ending_date?: string | null
};

export type WeatherLocation = {
  kind: 'origin' | 'destination'
  lat: number
  lng: number
  label: string
};

function coordsKey (lat: number, lng: number): string {
  return `${lat.toFixed(3)},${lng.toFixed(3)}`;
}

export function weatherLocationsFromTrip (trip: TripWeatherPlaceFields): WeatherLocation[] {
  const locations: WeatherLocation[] = [];
  let originKey: string | undefined;

  if (trip.origin_lat != null && trip.origin_lng != null) {
    originKey = coordsKey(trip.origin_lat, trip.origin_lng);
    locations.push({
      kind: 'origin',
      lat: trip.origin_lat,
      lng: trip.origin_lng,
      label: trip.starting_point?.trim() || 'Starting point',
    });
  }

  if (trip.destination_lat != null && trip.destination_lng != null) {
    const destinationKey = coordsKey(trip.destination_lat, trip.destination_lng);
    if (destinationKey !== originKey) {
      locations.push({
        kind: 'destination',
        lat: trip.destination_lat,
        lng: trip.destination_lng,
        label: trip.ending_point?.trim() || 'Ending point',
      });
    }
  }

  return locations;
}

export function tripWeatherWatchKey (
  tripId: number | null | undefined,
  trip: TripWeatherPlaceFields | null | undefined,
): string {
  return [
    tripId ?? 'none',
    trip?.origin_lat ?? '',
    trip?.origin_lng ?? '',
    trip?.starting_point ?? '',
    trip?.destination_lat ?? '',
    trip?.destination_lng ?? '',
    trip?.ending_point ?? '',
    trip?.starting_date ?? '',
    trip?.ending_date ?? '',
  ].join('|');
}

