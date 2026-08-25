-- Persist geocoded origin/destination for weather (issue #13).
-- Labels stay on starting_point / ending_point. Coordinates are optional so
-- free-text trips remain valid. Lat/lng are the source of truth; place_id is
-- the geocoder's id (Geoapify today) and can be swapped later.

ALTER TABLE public.trips
  ADD COLUMN origin_lat double precision,
  ADD COLUMN origin_lng double precision,
  ADD COLUMN origin_place_id text,
  ADD COLUMN destination_lat double precision,
  ADD COLUMN destination_lng double precision,
  ADD COLUMN destination_place_id text;

ALTER TABLE public.trips
  ADD CONSTRAINT trips_origin_coords_pair
    CHECK ((origin_lat IS NULL) = (origin_lng IS NULL)),
  ADD CONSTRAINT trips_destination_coords_pair
    CHECK ((destination_lat IS NULL) = (destination_lng IS NULL)),
  ADD CONSTRAINT trips_origin_lat_range
    CHECK (origin_lat IS NULL OR (origin_lat >= -90 AND origin_lat <= 90)),
  ADD CONSTRAINT trips_origin_lng_range
    CHECK (origin_lng IS NULL OR (origin_lng >= -180 AND origin_lng <= 180)),
  ADD CONSTRAINT trips_destination_lat_range
    CHECK (destination_lat IS NULL OR (destination_lat >= -90 AND destination_lat <= 90)),
  ADD CONSTRAINT trips_destination_lng_range
    CHECK (destination_lng IS NULL OR (destination_lng >= -180 AND destination_lng <= 180));
