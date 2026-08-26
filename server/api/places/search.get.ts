/**
 * @api {get} /places/search Search places
 * @apiName SearchPlaces
 * @summary Autocomplete trip origin/destination via Geoapify
 */
import { isError } from 'h3';
import { serverSupabaseUser } from '#supabase/server';
import { searchPlaces } from '@/server/utils/geoapifyPlaces';
import { throwPublicError } from '@/server/utils/reportServerError';
import { GEOAPIFY_ATTRIBUTION } from '@/types/places';
import type { PlaceSearchResponse } from '@/types/places';

export default defineEventHandler(async (event): Promise<PlaceSearchResponse> => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const raw = getQuery(event).q;
    const query = typeof raw === 'string' ? raw.trim() : '';
    if (query.length < 2) {
      return { attribution: GEOAPIFY_ATTRIBUTION, places: [] };
    }

    const config = useRuntimeConfig(event);
    const apiKey = String(config.geoapifyApiKey ?? '')
      .trim();
    if (!apiKey) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Place search is not configured.',
      });
    }
    const places = await searchPlaces(query, apiKey);
    return { attribution: GEOAPIFY_ATTRIBUTION, places };
  } catch (err) {
    if (isError(err)) throw err;
    return throwPublicError(err, {
      statusCode: 502,
      statusMessage: 'Place search is unavailable right now.',
      tags: { route: '/api/places/search' },
    });
  }
});
