import { createTtlCache } from '@/server/utils/ttlCache';
import {
  airQualitySnapshot,
  clampForecastRange,
  dailyMaxAqi,
} from '@/utils/tripWeather';
import type {
  AirQualitySnapshot,
  TripWeatherDay,
  WeatherUnits,
} from '@/types/weather';

type OpenMeteoDaily = {
  time?: string[]
  temperature_2m_max?: Array<number | null>
  temperature_2m_min?: Array<number | null>
  precipitation_probability_max?: Array<number | null>
  weather_code?: Array<number | null>
};

type OpenMeteoResponse = {
  daily?: OpenMeteoDaily
};

const forecastCache = createTtlCache<TripWeatherDay[]>(3 * 60 * 60 * 1000);

type AirQualityPayload = {
  current?: { us_aqi?: number | null }
  hourly?: {
    time?: string[]
    us_aqi?: Array<number | null>
  }
};

export type TripAirQuality = {
  current: AirQualitySnapshot | null
  byDate: Record<string, AirQualitySnapshot>
};

const airQualityCache = createTtlCache<TripAirQuality>(3 * 60 * 60 * 1000);

function roundCoord (value: number): string {
  return value.toFixed(3);
}

function unitParams (units: WeatherUnits) {
  return {
    temperature_unit: units === 'imperial' ? 'fahrenheit' : 'celsius',
    precipitation_unit: units === 'imperial' ? 'inch' : 'mm',
  };
}

export async function fetchForecastWeather (input: {
  lat: number
  lng: number
  startingDate: string | null
  endingDate: string | null
  units: WeatherUnits
}): Promise<TripWeatherDay[]> {
  const range = clampForecastRange(input.startingDate, input.endingDate);
  const cacheKey = [
    'forecast',
    roundCoord(input.lat),
    roundCoord(input.lng),
    range.start,
    range.end,
    input.units,
  ].join(':');

  const cached = forecastCache.get(cacheKey);
  if (cached) return cached;

  const payload = await $fetch<OpenMeteoResponse>('https://api.open-meteo.com/v1/forecast', {
    method: 'GET',
    timeout: 8000,
    query: {
      latitude: input.lat,
      longitude: input.lng,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
      timezone: 'auto',
      start_date: range.start,
      end_date: range.end,
      ...unitParams(input.units),
    },
  });

  const days = mapForecastDays(payload.daily);
  forecastCache.set(cacheKey, days);
  return days;
}

export async function fetchAirQuality (input: {
  lat: number
  lng: number
}): Promise<TripAirQuality> {
  const cacheKey = ['aqi', roundCoord(input.lat), roundCoord(input.lng)].join(':');
  const cached = airQualityCache.get(cacheKey);
  if (cached) return cached;

  const payload = await $fetch<AirQualityPayload>('https://air-quality-api.open-meteo.com/v1/air-quality', {
    method: 'GET',
    timeout: 8000,
    query: {
      latitude: input.lat,
      longitude: input.lng,
      current: 'us_aqi',
      hourly: 'us_aqi',
      forecast_days: 7,
      timezone: 'auto',
      domains: 'auto',
    },
  });

  const airQuality: TripAirQuality = {
    current: airQualitySnapshot(payload.current?.us_aqi),
    byDate: dailyMaxAqi(payload.hourly?.time ?? [], payload.hourly?.us_aqi ?? []),
  };
  airQualityCache.set(cacheKey, airQuality);
  return airQuality;
}

function mapForecastDays (daily: OpenMeteoDaily | undefined): TripWeatherDay[] {
  if (!daily?.time?.length) return [];
  return daily.time.map((date, index) => ({
    date,
    high: daily.temperature_2m_max?.[index] ?? 0,
    low: daily.temperature_2m_min?.[index] ?? 0,
    precipChance: daily.precipitation_probability_max?.[index] ?? null,
    weatherCode: daily.weather_code?.[index] ?? 1,
    airQuality: null,
  }));
}
