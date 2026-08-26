import { describe, expect, it } from 'vitest';
import {
  airQualityLabel,
  clampForecastRange,
  dailyMaxAqi,
  hasTripStartDate,
  shouldUseForecast,
  tripWeatherWatchKey,
  usAqiCategory,
  weatherIconKind,
  weatherLocationsFromTrip,
  weatherUnitsFromMeasuringSystem,
} from '@/utils/tripWeather';

describe('tripWeather', () => {
  it('uses imperial unless the profile is metric', () => {
    expect(weatherUnitsFromMeasuringSystem('IMPERIAL'))
      .toBe('imperial');
    expect(weatherUnitsFromMeasuringSystem('METRIC'))
      .toBe('metric');
  });

  it('uses a forecast when the trip starts within 14 days', () => {
    const now = new Date('2026-08-25T12:00:00Z');
    expect(shouldUseForecast('2026-08-30T00:00:00Z', now))
      .toBe(true);
    expect(shouldUseForecast('2026-09-08T00:00:00Z', now))
      .toBe(true);
    expect(shouldUseForecast('2026-09-09T00:00:00Z', now))
      .toBe(false);
    expect(shouldUseForecast('2026-10-01T00:00:00Z', now))
      .toBe(false);
    expect(shouldUseForecast(null, now))
      .toBe(false);
    expect(hasTripStartDate(null))
      .toBe(false);
    expect(hasTripStartDate('2026-08-30T00:00:00Z'))
      .toBe(true);
  });

  it('clamps the forecast range to today through the horizon', () => {
    const now = new Date('2026-08-25T12:00:00Z');
    expect(clampForecastRange('2026-08-20T00:00:00Z', '2026-09-20T00:00:00Z', now))
      .toEqual({ end: '2026-09-10', start: '2026-08-25' });
  });

  it('maps WMO codes onto icon kinds', () => {
    expect(weatherIconKind(0))
      .toBe('sun');
    expect(weatherIconKind(61))
      .toBe('rain');
    expect(weatherIconKind(73))
      .toBe('snow');
    expect(weatherIconKind(95))
      .toBe('thunder');
  });

  it('maps US AQI onto EPA categories', () => {
    expect(usAqiCategory(32))
      .toBe('good');
    expect(usAqiCategory(80))
      .toBe('moderate');
    expect(usAqiCategory(140))
      .toBe('unhealthy_sensitive');
    expect(airQualityLabel('unhealthy_sensitive'))
      .toBe('Unhealthy for sensitive groups');
  });

  it('takes the worst hourly US AQI per calendar day', () => {
    expect(dailyMaxAqi(
      ['2026-08-25T08:00', '2026-08-25T15:00', '2026-08-26T09:00'],
      [20, 85, 40],
    ))
      .toEqual({
        '2026-08-25': { aqi: 85, category: 'moderate' },
        '2026-08-26': { aqi: 40, category: 'good' },
      });
  });

  it('builds weather locations from origin and destination', () => {
    expect(weatherLocationsFromTrip({
      origin_lat: 34.6265,
      origin_lng: -84.1938,
      starting_point: 'Springer Mountain',
    }))
      .toEqual([{
        kind: 'origin',
        label: 'Springer Mountain',
        lat: 34.6265,
        lng: -84.1938,
      }]);

    expect(weatherLocationsFromTrip({
      destination_lat: 45.9044,
      destination_lng: -68.9213,
      ending_point: 'Mount Katahdin',
    }))
      .toEqual([{
        kind: 'destination',
        label: 'Mount Katahdin',
        lat: 45.9044,
        lng: -68.9213,
      }]);

    expect(weatherLocationsFromTrip({
      destination_lat: 48.75,
      destination_lng: -121.68,
      ending_point: 'Hannegan Trailhead',
      origin_lat: 48.75,
      origin_lng: -121.68,
      starting_point: 'Hannegan Trailhead',
    }))
      .toHaveLength(1);

    expect(weatherLocationsFromTrip({
      destination_lat: 45.9044,
      destination_lng: -68.9213,
      ending_point: 'Mount Katahdin',
      origin_lat: 34.6265,
      origin_lng: -84.1938,
      starting_point: 'Springer Mountain',
    }))
      .toHaveLength(2);
  });

  it('changes the weather watch key when either place changes', () => {
    const origin = tripWeatherWatchKey(2, {
      origin_lat: 34.6,
      origin_lng: -84.2,
      starting_point: 'Springer Mountain',
    });
    const newOrigin = tripWeatherWatchKey(2, {
      origin_lat: 48.75,
      origin_lng: -121.68,
      starting_point: 'Hannegan Trailhead',
    });
    const newDestination = tripWeatherWatchKey(2, {
      destination_lat: 45.9,
      destination_lng: -68.9,
      ending_point: 'Mount Katahdin',
      origin_lat: 34.6,
      origin_lng: -84.2,
      starting_point: 'Springer Mountain',
    });

    expect(origin)
      .not
      .toBe(newOrigin);
    expect(origin)
      .not
      .toBe(newDestination);
    expect(tripWeatherWatchKey(2, { starting_date: '2026-08-30T00:00:00Z' }))
      .not
      .toBe(tripWeatherWatchKey(2, { starting_date: null }));
  });
});
