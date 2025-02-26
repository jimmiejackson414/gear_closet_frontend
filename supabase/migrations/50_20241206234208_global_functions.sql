-- Handle new user
------------------------
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  INSERT INTO public.profiles (id, email, image, role, measuring_system)
  values (new.id, new.email, null, 'USER', 'IMPERIAL')
  ON CONFLICT (id) DO UPDATE SET email = new.email;
  INSERT INTO public.notifications (title, content, read_on_date, profile_id, sender_id)
  values ('Welcome!', 'Welcome to Gear Closet! This is where you will receive all of your important updates.', null, new.id, '00000000-0000-0000-0000-000000000000');
  INSERT INTO public.trips (name, description, starting_point, ending_point, starting_date, ending_date, slug, profile_id)
  values ('My first trip!', 'This is my first trip to plan.', 'Starting point', 'Ending point', null, null, null, new.id);
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";
CREATE OR REPLACE TRIGGER "handle_new_user" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE PROCEDURE "public"."handle_new_user"();

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

-- Get dashboard data function
------------------------
CREATE OR REPLACE FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) RETURNS "json"
  LANGUAGE "plpgsql" SECURITY DEFINER
  AS $$
  DECLARE
    trip_friends JSON;
    trips JSON;
    friends JSON;
  BEGIN
    -- Fetch trip_friends
    SELECT COALESCE(json_agg(
      json_build_object(
        'id', tf.id,
        'trip_id', tf.trip_id,
        'accepted_invite_on', tf.accepted_invite_on,
        'created_at', tf.created_at,
        'status', tf.status,
        'profile_id', tf.profile_id,
        'invited_by_id', tf.invited_by_id,
        'invite_token', tf.invite_token,
        'updated_at', tf.updated_at,
        'profile', row_to_json(p.*),
        'trip', row_to_json(t.*)
      )
    ), '[]'::JSON) INTO trip_friends
    FROM trip_friends tf
    LEFT JOIN profiles p ON tf.invited_by_id = p.id
    LEFT JOIN trips t ON tf.trip_id = t.id
    WHERE tf.profile_id = p_user_id
    AND tf.status = 'PENDING';

    -- Fetch trips
    SELECT COALESCE(json_agg(row_to_json(t.*)), '[]'::JSON) INTO trips
    FROM trips t
    JOIN trip_friends tf ON t.id = tf.trip_id
    WHERE tf.profile_id = p_user_id
      AND (tf.role = 'OWNER' OR (tf.role = 'MEMBER' AND tf.status = 'ACCEPTED'))
      AND t.starting_date >= NOW();

    -- Fetch friends
    SELECT COALESCE(json_agg(row_to_json(sub.*)), '[]'::JSON) INTO friends
    FROM (
      SELECT f.*, row_to_json(p.*) AS friend
      FROM friends f
      JOIN profiles p ON f.friend_id = p.id
      WHERE f.profile_id = p_user_id
    ) sub;

    -- Output the result
    RETURN json_build_object(
        'trip_friends', trip_friends,
        'trips', trips,
        'friends', friends
    );
  END;
$$;
ALTER FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) OWNER TO "postgres";

-- Get planning page data function
------------------------
CREATE OR REPLACE FUNCTION public.get_planning_page_data(p_trip_id bigint)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  DECLARE
    trips_data JSON;
    trip_packs_data JSON;
    trip_details_data JSON;
    todos_data JSON;
    shopping_items_data JSON;
    friends_data JSON;
    poll_data JSON;
    dynamic_trip_id BIGINT;
    is_trip_owner BOOLEAN;
  BEGIN

  -- Fetch all trips where the user is an OWNER (no status check) or an ACCEPTED MEMBER
  SELECT json_agg(row_to_json(sub.*)) INTO trips_data
  FROM (
    SELECT DISTINCT t.*
    FROM trips t
    JOIN trip_friends tf ON tf.trip_id = t.id
    WHERE tf.profile_id = auth.uid()
      AND (tf.role = 'OWNER' OR (tf.role = 'MEMBER' AND tf.status = 'ACCEPTED'))
    ORDER BY t.created_at ASC
  ) sub;

  -- Set dynamic_trip_id to the first trip found
  SELECT COALESCE((
    SELECT sub.id 
    FROM (
      SELECT DISTINCT t.id
      FROM trips t
      JOIN trip_friends tf ON tf.trip_id = t.id
      WHERE tf.profile_id = auth.uid()
        AND (tf.role = 'OWNER' OR (tf.role = 'MEMBER' AND tf.status = 'ACCEPTED'))
      ORDER BY t.created_at ASC
      LIMIT 1
    ) sub
  ), 0) INTO dynamic_trip_id;

  -- If p_trip_id is provided, use it instead
  IF p_trip_id != 0 THEN
    dynamic_trip_id := p_trip_id;
  END IF;

    -- Fetch trip packs data using dynamic_trip_id along with associated pack details
    SELECT (COALESCE(json_agg(
      json_build_object(
        'id', pack.id,
        'name', pack.name,
        'slug', pack.slug,
        'created_at', pack.created_at,
        'updated_at', pack.updated_at,
        'profile_id', pack.profile_id,
        'theme', pack.theme,
        'private', pack.private,
        'allow_comments', pack.allow_comments,
        'categories', (
          SELECT COALESCE(json_agg(json_build_object(
            'id', c.id,
            'created_at', c.created_at,
            'name', c.name,
            'unit', c.unit,
            'slug', c.slug,
            'pack_id', c.pack_id,
            'updated_at', c.updated_at,
            'category_items', (
              SELECT COALESCE(json_agg(json_build_object(
                'id', ci.id,
                'category_id', ci.category_id,
                'item_id', ci.item_id,
                'position', ci.position,
                'created_at', ci.created_at,
                'updated_at', ci.updated_at,
                'item', row_to_json(i.*)
              )), '[]'::JSON)
              FROM category_items ci
              JOIN items i ON ci.item_id = i.id
              WHERE ci.category_id = c.id
            )
          )), '[]'::JSON)
          FROM categories c
          WHERE c.pack_id = pack.id
        )
      )
    ), '[]'::JSON) -> 0) INTO trip_packs_data
    FROM trip_packs tp
    JOIN packs pack ON tp.pack_id = pack.id
    WHERE tp.profile_id = auth.uid()
      AND (p_trip_id = 0 OR tp.trip_id = dynamic_trip_id);

    -- Fetch trip details data
    SELECT COALESCE(json_agg(row_to_json(td.*)), '[]'::JSON) INTO trip_details_data
    FROM trip_details td
    WHERE td.trip_id = dynamic_trip_id;

    -- Fetch todos data
    SELECT COALESCE(json_agg(row_to_json(todo.*)), '[]'::JSON) INTO todos_data
      FROM todos todo
      WHERE (todo.resource_type = 'USER' AND todo.profile_id = auth.uid()) 
        OR (todo.resource_type = 'GROUP' AND todo.trip_id = dynamic_trip_id);

    -- Fetch shopping items data
    SELECT COALESCE(json_agg(row_to_json(si.*)), '[]'::JSON) INTO shopping_items_data
      FROM shopping_list_items si
      WHERE (si.resource_type = 'USER' AND si.profile_id = auth.uid()) 
        OR (si.resource_type = 'GROUP' AND si.trip_id = dynamic_trip_id);

    -- Fetch friends data with details from related tables
    SELECT COALESCE(
      jsonb_agg(
        jsonb_set(
          row_to_json(tf)::jsonb,
          '{profile}',
          jsonb_set(
            row_to_json(p)::jsonb,
            '{trip_pack}',
            COALESCE((
              SELECT jsonb_set(
                row_to_json(tp)::jsonb,
                '{pack}',
                COALESCE((
                  SELECT row_to_json(pk)::jsonb
                  FROM packs pk
                  WHERE pk.id = tp.pack_id
                ), 'null'::jsonb),
                true
              )
              FROM trip_packs tp
              WHERE tp.profile_id = p.id
                AND (dynamic_trip_id = 0 OR tp.trip_id = dynamic_trip_id)
              LIMIT 1
            ), 'null'::jsonb),
            true
          ),
          true
        )
      ), '[]'::jsonb
    ) INTO friends_data
    FROM trip_friends tf
    JOIN profiles p ON tf.profile_id = p.id
    WHERE tf.trip_id = dynamic_trip_id
      AND tf.profile_id != auth.uid();

    -- Fetch poll data
    SELECT json_build_object(
      'id', p.id::integer,
      'trip_id', p.trip_id::integer,
      'profile_id', p.profile_id::uuid,
      'question', (SELECT row_to_json(q.*) FROM questions q WHERE q.poll_id = p.id),
      'answers', COALESCE((SELECT json_agg(row_to_json(a.*)) FROM answers a WHERE a.question_id = q.id), '[]'),
      'votes', COALESCE((SELECT json_agg(row_to_json(pa.*)) FROM profile_answers pa WHERE pa.poll_id = p.id), '[]')
    ) INTO poll_data
    FROM polls p
    JOIN questions q ON p.id = q.poll_id
    WHERE p.trip_id = dynamic_trip_id
    LIMIT 1;

    -- Compute is_owner flag for the current user
    SELECT EXISTS (
      SELECT 1
      FROM trip_friends
      WHERE trip_id = dynamic_trip_id
        AND profile_id = auth.uid()
        AND role = 'OWNER'
    ) INTO is_trip_owner;

    -- Output the result
    RETURN jsonb_build_object(
      'trips', trips_data,
      'pack', trip_packs_data,
      'trip_details', trip_details_data,
      'todos', todos_data,
      'shopping_items', shopping_items_data,
      'friends', friends_data,
      'poll', poll_data,
      'is_trip_owner', is_trip_owner
    );
    END;
$function$

ALTER FUNCTION "public"."get_planning_page_data"("p_trip_id" bigint) OWNER TO "postgres";

-- Get closet page data function
------------------------
CREATE OR REPLACE FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) RETURNS "json"
  LANGUAGE "plpgsql" SECURITY DEFINER
  AS $$
  DECLARE
    pack_data JSON;
    dynamic_pack_id BIGINT;
    user_packs JSON;
  BEGIN
    -- Set dynamic_pack_id based on p_pack_id or to the ID of the first pack
    IF p_pack_id = 0 THEN
      SELECT COALESCE((SELECT p.id FROM packs p WHERE p.profile_id = auth.uid() ORDER BY p.created_at ASC LIMIT 1), 0) INTO dynamic_pack_id;
    ELSE
      dynamic_pack_id := p_pack_id;
    END IF;

    -- Fetch all user's packs
    SELECT COALESCE((SELECT json_agg(json_build_object('id', p.id, 'name', p.name, 'slug', p.slug)) FROM packs p WHERE p.profile_id = auth.uid()), '[]'::JSON) INTO user_packs;

    -- Fetch pack data using dynamic_pack_id along with associated category details, category items, and items
    SELECT COALESCE((SELECT json_build_object(
      'pack', json_build_object(
        'id', pack.id,
        'name', pack.name,
        'slug', pack.slug,
        'created_at', pack.created_at,
        'updated_at', pack.updated_at,
        'profile_id', pack.profile_id,
        'theme', pack.theme,
        'private', pack.private,
        'allow_comments', pack.allow_comments,
        'categories', (
          SELECT COALESCE(json_agg(json_build_object(
            'id', sub.id,
            'created_at', sub.created_at,
            'name', sub.name,
            'unit', sub.unit,
            'slug', sub.slug,
            'pack_id', sub.pack_id,
            'updated_at', sub.updated_at,
            'category_items', sub.category_items
          )), '[]'::JSON)
          FROM (
            SELECT
              c.id,
              c.created_at,
              c.name,
              c.unit,
              c.slug,
              c.pack_id,
              c.updated_at,
              (
                SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.position), '[]'::JSON)
                FROM (
                  SELECT
                    ci.id,
                    ci.category_id,
                    ci.item_id,
                    ci.position,
                    ci.created_at,
                    ci.updated_at,
                    row_to_json(i.*) AS item
                  FROM category_items ci
                  JOIN items i ON ci.item_id = i.id
                  WHERE ci.category_id = c.id
                ) t
              ) AS category_items
            FROM categories c
            WHERE c.pack_id = dynamic_pack_id
            ORDER BY c.position ASC
          ) AS sub
        )
      ),
      'packs', user_packs
    ) FROM packs pack WHERE pack.id = dynamic_pack_id ORDER BY pack.created_at DESC), '[]'::JSON) INTO pack_data;

    -- Output the result
    RETURN pack_data;
  END;
$$;
ALTER FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) OWNER TO "postgres";

-- Import CSV Data function
------------------------
CREATE OR REPLACE FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  "row_data" JSONB;
  "cat_id" BIGINT;
  "item_id" BIGINT;
  "item_position" INTEGER;  -- renamed from "position"
BEGIN
  FOR "row_data" IN SELECT * FROM jsonb_array_elements("csv_data")
  LOOP
    -- Try to get the existing category id
    SELECT "id" INTO "cat_id" FROM "public"."categories" WHERE "name" = "row_data"->>'category' AND "pack_id" = "p_pack_id";

    -- If category doesn't exist, insert it and get the id
    IF "cat_id" IS NULL THEN
      INSERT INTO "public"."categories" ("name", "slug", "unit", "pack_id", "created_at", "updated_at")
      VALUES ("row_data"->>'category', 'slug', 'g', "p_pack_id", NOW(), NOW())
      RETURNING "id" INTO "cat_id";
      -- Reset position counter for new category
      "item_position" := 1;  -- renamed from "position"
    ELSE
      -- Get the current maximum position in the category
      SELECT COALESCE(MAX("position"), 0) + 1 INTO "item_position" FROM "public"."category_items" WHERE "category_id" = "cat_id";  -- renamed from "position"
    END IF;

    -- Insert item
    INSERT INTO "public"."items" (
      "name", "generic_type", "price", "consumable", "worn", "quantity", "unit", "weight", "url", "slug", "created_at", "updated_at", "profile_id"
    )
    VALUES (
      "row_data"->>'item_name',
      "row_data"->>'desc',
      ("row_data"->>'price')::bigint,
      (trim("row_data"->>'consumable') != '')::boolean,
      (trim("row_data"->>'worn') != '')::boolean,
      ("row_data"->>'qty')::bigint,
      ("row_data"->>'unit')::item_unit,
      ("row_data"->>'weight')::numeric,
      "row_data"->>'url',
      'slug',
      NOW(),
      NOW(),
      auth.uid()
    )
    RETURNING "id" INTO "item_id";

    -- Link item to category
    INSERT INTO "public"."category_items" ("category_id", "item_id", "position", "created_at", "updated_at")
    VALUES ("cat_id", "item_id", "item_position", NOW(), NOW());  -- renamed from "position"
  END LOOP;

  -- Return the data in the desired format
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
        FROM "public"."category_items" ci
        JOIN "public"."items" i ON ci."item_id" = i."id"
        WHERE ci."category_id" = c."id"
      )
    ))
    FROM "public"."categories" c
    WHERE c."pack_id" = "p_pack_id"
  );
END;
$$;
ALTER FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) OWNER TO "postgres";

-- Create default category and item
------------------------
CREATE OR REPLACE FUNCTION "public"."create_category_and_item"(
  "p_name" TEXT,
  "p_pack_id" BIGINT,
  "p_items" JSONB
)
  RETURNS JSON
  LANGUAGE plpgsql
  AS $$
  DECLARE
    "new_category_id" BIGINT;
    "new_item_id" BIGINT;
    "item" JSONB;
  BEGIN
    -- Insert the new category
    INSERT INTO "public"."categories" ("name", "pack_id")
    VALUES ("p_name", "p_pack_id")
    RETURNING "id" INTO "new_category_id";

    -- Loop through the items array
    FOR item IN SELECT * FROM jsonb_array_elements("p_items")
    LOOP
      -- Insert the new item
      INSERT INTO "public"."items" (
        "name", "generic_type", "weight", "quantity", "price",
        "consumable", "worn", "profile_id", "unit"
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
        COALESCE((item->>'unit')::item_unit, 'oz'::item_unit) -- Use default "oz" if NULL
      )
      RETURNING "id" INTO "new_item_id";

      -- Link the new category and item in the category_items table
      INSERT INTO "public"."category_items" ("category_id", "item_id", "position")
      VALUES ("new_category_id", "new_item_id", 1);
    END LOOP;

    -- Return the new category and item in the same format as the other functions
    RETURN (
      SELECT row_to_json(t)
      FROM (
        SELECT c."id", c."name", c."slug", c."unit", c."pack_id", c."created_at", c."updated_at",
          json_agg(json_build_object(
            'id', ci."id",
            'category_id', ci."category_id",
            'item_id', ci."item_id",
            'position', ci."position",
            'created_at', ci."created_at",
            'updated_at', ci."updated_at",
            'item', row_to_json(i)
          )) AS "category_items"
        FROM "public"."categories" c
        JOIN "public"."category_items" ci ON c."id" = ci."category_id"
        JOIN "public"."items" i ON ci."item_id" = i."id"
        WHERE c."id" = "new_category_id"
        GROUP BY c."id", c."name", c."slug", c."unit", c."pack_id", c."created_at", c."updated_at"
      ) t
    );
  END;
$$;
ALTER FUNCTION "public"."create_category_and_item"(TEXT, BIGINT, JSONB) OWNER TO "postgres";

-- Update positions function
------------------------
CREATE OR REPLACE FUNCTION "public"."update_positions"(records public.category_item_position[])
RETURNS SETOF json AS $$
DECLARE
  r public.category_item_position;
  i integer;
  updated_record json;
BEGIN
  FOR i IN 1..array_length(records, 1)
  LOOP
    r := records[i];
    UPDATE public.category_items
    SET position = r.new_position, category_id = r.category_id
    WHERE id = r.category_item_id;

    SELECT row_to_json(category_items) INTO updated_record
    FROM public.category_items
    WHERE id = r.category_item_id;

    RETURN NEXT updated_record;
  END LOOP;
  RETURN;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION "public"."update_positions"(records public.category_item_position[]) OWNER TO "postgres";

-- Grant permissions
------------------------
GRANT ALL ON FUNCTION "public"."create_category_and_item"("p_name" TEXT, "p_pack_id" BIGINT, "p_items" JSONB) TO "anon";
GRANT ALL ON FUNCTION "public"."create_category_and_item"("p_name" TEXT, "p_pack_id" BIGINT, "p_items" JSONB) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_category_and_item"("p_name" TEXT, "p_pack_id" BIGINT, "p_items" JSONB) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_data"("p_user_id" uuid) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_planning_page_data"("p_trip_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_planning_page_data"("p_trip_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_planning_page_data"("p_trip_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_closet_page_data"("p_pack_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) TO "anon";
GRANT ALL ON FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) TO "authenticated";
GRANT ALL ON FUNCTION "public"."import_csv_data"("csv_data" JSONB, "p_pack_id" BIGINT) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_positions"(records public.category_item_position[]) TO "anon";
GRANT ALL ON FUNCTION "public"."update_positions"(records public.category_item_position[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_positions"(records public.category_item_position[]) TO "service_role";
