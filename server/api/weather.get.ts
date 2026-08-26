/**
 * @api {get} /weather Trip weather
 * @apiName GetTripWeather
 * @summary Forecast weather for a trip origin and destination when the start is within 14 days
 */
import { isError } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import {
  fetchAirQuality,
  fetchForecastWeather,
  type TripAirQuality,
} from '@/server/utils/openMeteoWeather';
import { throwPublicError } from '@/server/utils/reportServerError';
import { WEATHER_AVAILABLE_WITHIN_DAYS, type TripWeatherPlaceForecast, type TripWeatherResponse, type WeatherUnits } from '@/types/weather';
import {
  hasTripStartDate,
  shouldUseForecast,
  weatherLocationsFromTrip,
  weatherUnitsFromMeasuringSystem,
  type WeatherLocation,
} from '@/utils/tripWeather';
import type { Database } from '@/types';

const emptyAirQuality: TripAirQuality = { byDate: {}, current: null };

async function forecastForLocation (
  location: WeatherLocation,
  dates: { startingDate: string | null; endingDate: string | null },
  units: WeatherUnits,
): Promise<TripWeatherPlaceForecast> {
  const [airQuality, days] = await Promise.all([
    fetchAirQuality({
      lat: location.lat,
      lng: location.lng,
    })
      .catch(() => emptyAirQuality),
    fetchForecastWeather({
      endingDate: dates.endingDate,
      lat: location.lat,
      lng: location.lng,
      startingDate: dates.startingDate,
      units,
    }),
  ]);

  return {
    currentAirQuality: airQuality.current,
    days: days.map(day => ({
      ...day,
      airQuality: airQuality.byDate[day.date] ?? null,
    })),
    kind: location.kind,
    placeLabel: location.label,
  };
}

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
      .select('origin_lat, origin_lng, starting_point, destination_lat, destination_lng, ending_point, starting_date, ending_date')
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

    const locations = weatherLocationsFromTrip(trip);
    if (!locations.length) {
      return { status: 'needs_place' };
    }
    if (!hasTripStartDate(trip.starting_date)) {
      return { status: 'needs_date' };
    }
    if (!shouldUseForecast(trip.starting_date)) {
      return {
        availableWithinDays: WEATHER_AVAILABLE_WITHIN_DAYS,
        status: 'too_far',
      };
    }

    const { data: profile } = await supabase.from('profiles')
      .select('measuring_system')
      .eq('id', user.sub)
      .maybeSingle();
    const units = weatherUnitsFromMeasuringSystem(profile?.measuring_system);

    return {
      places: await Promise.all(locations.map(location => forecastForLocation(
        location,
        {
          endingDate: trip.ending_date,
          startingDate: trip.starting_date,
        },
        units,
      ))),
      status: 'forecast',
      units,
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
