-- Issue #100: poll RPCs still callable by anon via PUBLIC EXECUTE (advisor lint 0028).
-- Migration 57 revoked anon but not PUBLIC; match get_closet_page_data grant pattern.

REVOKE ALL ON FUNCTION public.create_poll(bigint, text, text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_poll(bigint, text, text[]) FROM anon;
REVOKE ALL ON FUNCTION public.update_poll(bigint, text, text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_poll(bigint, text, text[]) FROM anon;

GRANT EXECUTE ON FUNCTION public.create_poll(bigint, text, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_poll(bigint, text, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_poll(bigint, text, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_poll(bigint, text, text[]) TO service_role;
