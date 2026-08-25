/**
 * @api {get} /weather Trip weather
 * @apiName GetTripWeather
 * @summary Forecast weather for a trip origin when the start is within 14 days
 */
import { isError } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import {
  fetchAirQuality,
  fetchForecastWeather,
  type TripAirQuality,
} from '@/server/utils/openMeteoWeather';
import { throwPublicError } from '@/server/utils/reportServerError';
import { WEATHER_AVAILABLE_WITHIN_DAYS, type TripWeatherResponse } from '@/types/weather';
import {
  shouldUseForecast,
  weatherUnitsFromMeasuringSystem,
} from '@/utils/tripWeather';
import type { Database } from '@/types';

export default defineEventHandler(async (event): Promise<TripWeatherResponse> => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const rawId = getQuery(event).tripId;
    const tripId = Number(rawId);
    if (!Number.isInteger(tripId) || tripId <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'A valid tripId is required.',
      });
    }

    const supabase = await serverSupabaseClient<Database>(event);
    const { data: trip, error: tripError } = await supabase.from('trips')
      .select('origin_lat, origin_lng, starting_point, starting_date, ending_date')
      .eq('id', tripId)
      .maybeSingle();

    if (tripError) {
      throw tripError;
    }
    if (!trip) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Trip not found.',
      });
    }
    if (trip.origin_lat == null || trip.origin_lng == null) {
      return { status: 'needs_place' };
    }
    if (!shouldUseForecast(trip.starting_date)) {
      return {
        status: 'too_far',
        availableWithinDays: WEATHER_AVAILABLE_WITHIN_DAYS,
      };
    }

    const { data: profile } = await supabase.from('profiles')
      .select('measuring_system')
      .eq('id', user.sub)
      .maybeSingle();
    const units = weatherUnitsFromMeasuringSystem(profile?.measuring_system);
    const placeLabel = trip.starting_point?.trim() || 'Trip origin';
    const emptyAirQuality: TripAirQuality = { current: null, byDate: {} };

    const [airQuality, days] = await Promise.all([
      fetchAirQuality({
        lat: trip.origin_lat,
        lng: trip.origin_lng,
      })
        .catch(() => emptyAirQuality),
      fetchForecastWeather({
        lat: trip.origin_lat,
        lng: trip.origin_lng,
        startingDate: trip.starting_date,
        endingDate: trip.ending_date,
        units,
      }),
    ]);

    return {
      status: 'forecast',
      placeLabel,
      units,
      currentAirQuality: airQuality.current,
      days: days.map(day => ({
        ...day,
        airQuality: airQuality.byDate[day.date] ?? null,
      })),
    };
  } catch (err) {
    if (isError(err)) throw err;
    return throwPublicError(err, {
      statusCode: 502,
      statusMessage: 'Weather is unavailable right now.',
      tags: { route: '/api/weather' },
    });
  }
});
