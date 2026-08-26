-- LighterPack CSV import: normalize units/prices, skip invalid rows, verify pack ownership.

CREATE OR REPLACE FUNCTION public.normalize_csv_unit(raw text)
RETURNS public.item_unit
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE lower(trim(coalesce(raw, '')))
    WHEN 'g' THEN 'g'::public.item_unit
    WHEN 'gram' THEN 'g'::public.item_unit
    WHEN 'grams' THEN 'g'::public.item_unit
    WHEN 'kg' THEN 'kg'::public.item_unit
    WHEN 'kilogram' THEN 'kg'::public.item_unit
    WHEN 'kilograms' THEN 'kg'::public.item_unit
    WHEN 'oz' THEN 'oz'::public.item_unit
    WHEN 'ounce' THEN 'oz'::public.item_unit
    WHEN 'ounces' THEN 'oz'::public.item_unit
    WHEN 'lb' THEN 'lb'::public.item_unit
    WHEN 'lbs' THEN 'lb'::public.item_unit
    WHEN 'pound' THEN 'lb'::public.item_unit
    WHEN 'pounds' THEN 'lb'::public.item_unit
    ELSE 'oz'::public.item_unit
  END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_csv_price_cents(raw text)
RETURNS bigint
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  cleaned text;
  val numeric;
BEGIN
  cleaned := trim(coalesce(raw, ''));
  IF cleaned = '' THEN
    RETURN 0;
  END IF;

  cleaned := replace(replace(cleaned, '$', ''), ',', '');

  IF cleaned ~ '^\d+$' THEN
    RETURN cleaned::bigint;
  END IF;

  BEGIN
    val := cleaned::numeric;
  EXCEPTION WHEN OTHERS THEN
    RETURN 0;
  END;

  RETURN round(val * 100)::bigint;
END;
$$;

CREATE OR REPLACE FUNCTION public.import_csv_data(csv_data jsonb, p_pack_id bigint)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  row_data jsonb;
  cat_id bigint;
  item_id bigint;
  item_position integer;
  item_name text;
  category_name text;
  normalized_unit public.item_unit;
  imported_count integer := 0;
BEGIN
  IF NOT private.owns_pack(p_pack_id) THEN
    RAISE EXCEPTION 'Pack not found or access denied';
  END IF;

  FOR row_data IN SELECT * FROM jsonb_array_elements(csv_data)
  LOOP
    item_name := trim(coalesce(row_data->>'item_name', ''));
    category_name := trim(coalesce(row_data->>'category', ''));

    IF item_name = '' OR category_name = '' THEN
      CONTINUE;
    END IF;

    normalized_unit := public.normalize_csv_unit(row_data->>'unit');

    SELECT id INTO cat_id
    FROM public.categories
    WHERE name = category_name
      AND pack_id = p_pack_id;

    IF cat_id IS NULL THEN
      INSERT INTO public.categories (name, slug, unit, pack_id, created_at, updated_at)
      VALUES (category_name, 'slug', normalized_unit::text, p_pack_id, NOW(), NOW())
      RETURNING id INTO cat_id;
      item_position := 1;
    ELSE
      SELECT COALESCE(MAX(position), 0) + 1 INTO item_position
      FROM public.category_items
      WHERE category_id = cat_id;
    END IF;

    INSERT INTO public.items (
      name, generic_type, price, consumable, worn, quantity, unit, weight, url, slug,
      created_at, updated_at, profile_id
    )
    VALUES (
      item_name,
      nullif(trim(coalesce(row_data->>'desc', '')), ''),
      public.normalize_csv_price_cents(row_data->>'price'),
      (trim(coalesce(row_data->>'consumable', '')) != '')::boolean,
      (trim(coalesce(row_data->>'worn', '')) != '')::boolean,
      COALESCE(nullif(trim(coalesce(row_data->>'qty', '')), '')::bigint, 1),
      normalized_unit,
      trim(coalesce(row_data->>'weight', '0')),
      nullif(trim(coalesce(row_data->>'url', '')), ''),
      'slug',
      NOW(),
      NOW(),
      auth.uid()
    )
    RETURNING id INTO item_id;

    INSERT INTO public.category_items (category_id, item_id, position, created_at, updated_at)
    VALUES (cat_id, item_id, item_position, NOW(), NOW());

    imported_count := imported_count + 1;
  END LOOP;

  RETURN jsonb_build_object('imported_count', imported_count);
END;
$$;
