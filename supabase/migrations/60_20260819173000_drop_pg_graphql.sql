-- Issue #102: Disable pg_graphql — app uses REST + RPC only (no /graphql/v1 client).
-- Clears Security Advisor lints 0026 (anon) and 0027 (authenticated) for schema introspection.
-- RLS still governs row access via PostgREST; this removes GraphQL schema discoverability.

DROP EXTENSION IF EXISTS pg_graphql;
