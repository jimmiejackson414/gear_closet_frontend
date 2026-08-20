-- Issue #101: Pin search_path on remaining functions flagged by advisor lint 0011
-- (function_search_path_mutable). Follow-up to migration 57.

-- ---------------------------------------------------------------------------
-- private.uid — used by RLS helper predicates
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.uid()
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Trigger helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.slug := extensions.gen_random_uuid();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_profile_image()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.profiles
    SET image = NEW.name
    WHERE id = (storage.foldername(NEW.name))[1]::uuid;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.profiles
    SET image = NULL
    WHERE id = (storage.foldername(OLD.name))[1]::uuid;
    RETURN OLD;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.adjust_category_positions()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.categories
  SET position = position + 1
  WHERE pack_id = NEW.pack_id
    AND position >= NEW.position
    AND id != NEW.id;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.search_profiles(search_query text)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.profiles
  WHERE fts @@ to_tsquery('simple', search_query)
    AND id <> '00000000-0000-0000-0000-000000000000';
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
BEGIN
  FOR row_data IN SELECT * FROM jsonb_array_elements(csv_data)
  LOOP
    SELECT id INTO cat_id
    FROM public.categories
    WHERE name = row_data->>'category'
      AND pack_id = p_pack_id;

    IF cat_id IS NULL THEN
      INSERT INTO public.categories (name, slug, unit, pack_id, created_at, updated_at)
      VALUES (row_data->>'category', 'slug', 'g', p_pack_id, NOW(), NOW())
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
      row_data->>'item_name',
      row_data->>'desc',
      (row_data->>'price')::bigint,
      (trim(row_data->>'consumable') != '')::boolean,
      (trim(row_data->>'worn') != '')::boolean,
      (row_data->>'qty')::bigint,
      (row_data->>'unit')::public.item_unit,
      (row_data->>'weight')::numeric,
      row_data->>'url',
      'slug',
      NOW(),
      NOW(),
      auth.uid()
    )
    RETURNING id INTO item_id;

    INSERT INTO public.category_items (category_id, item_id, position, created_at, updated_at)
    VALUES (cat_id, item_id, item_position, NOW(), NOW());
  END LOOP;

  RETURN (
    SELECT json_agg(json_build_object(
      'id', c.id,
      'name', c.name,
      'slug', c.slug,
      'unit', c.unit,
      'pack_id', c.pack_id,
      'created_at', c.created_at,
      'updated_at', c.updated_at,
      'category_items', (
        SELECT json_agg(json_build_object(
          'id', ci.id,
          'category_id', ci.category_id,
          'item_id', ci.item_id,
          'position', ci.position,
          'created_at', ci.created_at,
          'updated_at', ci.updated_at,
          'item', i.*
        ))
        FROM public.category_items ci
        JOIN public.items i ON ci.item_id = i.id
        WHERE ci.category_id = c.id
      )
    ))
    FROM public.categories c
    WHERE c.pack_id = p_pack_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.create_category_and_item(
  p_name text,
  p_pack_id bigint,
  p_items jsonb
)
RETURNS json
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  new_category_id bigint;
  new_item_id bigint;
  item jsonb;
BEGIN
  INSERT INTO public.categories (name, pack_id)
  VALUES (p_name, p_pack_id)
  RETURNING id INTO new_category_id;

  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.items (
      name, generic_type, weight, quantity, price,
      consumable, worn, profile_id, unit
    )
    VALUES (
      item->>'name',
      item->>'generic_type',
      item->>'weight',
      (item->>'quantity')::bigint,
      (item->>'price')::bigint,
      (item->>'consumable')::boolean,
      (item->>'worn')::boolean,
      auth.uid(),
      COALESCE((item->>'unit')::public.item_unit, 'oz'::public.item_unit)
    )
    RETURNING id INTO new_item_id;

    INSERT INTO public.category_items (category_id, item_id, position)
    VALUES (new_category_id, new_item_id, 1);
  END LOOP;

  RETURN (
    SELECT row_to_json(t)
    FROM (
      SELECT
        c.id,
        c.name,
        c.slug,
        c.unit,
        c.pack_id,
        c.created_at,
        c.updated_at,
        json_agg(json_build_object(
          'id', ci.id,
          'category_id', ci.category_id,
          'item_id', ci.item_id,
          'position', ci.position,
          'created_at', ci.created_at,
          'updated_at', ci.updated_at,
          'item', row_to_json(i)
        )) AS category_items
      FROM public.categories c
      JOIN public.category_items ci ON c.id = ci.category_id
      JOIN public.items i ON ci.item_id = i.id
      WHERE c.id = new_category_id
      GROUP BY c.id, c.name, c.slug, c.unit, c.pack_id, c.created_at, c.updated_at
    ) t
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_positions(records public.category_item_position[])
RETURNS SETOF json
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  r public.category_item_position;
  i integer;
  updated_record json;
BEGIN
  FOR i IN 1..array_length(records, 1)
  LOOP
    r := records[i];
    UPDATE public.category_items
    SET position = r.new_position,
        category_id = r.category_id
    WHERE id = r.category_item_id;

    SELECT row_to_json(category_items) INTO updated_record
    FROM public.category_items
    WHERE id = r.category_item_id;

    RETURN NEXT updated_record;
  END LOOP;
  RETURN;
END;
$$;
