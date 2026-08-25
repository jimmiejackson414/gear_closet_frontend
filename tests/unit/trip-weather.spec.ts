import { describe, expect, it } from 'vitest';
import {
  airQualityLabel,
  clampForecastRange,
  dailyMaxAqi,
  shouldUseForecast,
  usAqiCategory,
  weatherIconKind,
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
  });

  it('clamps the forecast range to today through the horizon', () => {
    const now = new Date('2026-08-25T12:00:00Z');
    expect(clampForecastRange('2026-08-20T00:00:00Z', '2026-09-20T00:00:00Z', now))
      .toEqual({ start: '2026-08-25', end: '2026-09-10' });
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
});
