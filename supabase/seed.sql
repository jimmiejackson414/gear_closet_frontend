SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '2ab1dbb7-6a39-4037-b48e-83882bf303b7', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 20:41:10.719517+00', ''),
	('00000000-0000-0000-0000-000000000000', '5db53138-5757-44ef-870b-bbf64e98c162', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 20:41:20.470769+00', ''),
	('00000000-0000-0000-0000-000000000000', '6aeeec04-f5f8-4a9e-9f31-093b993e2ec4', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 05:17:27.842964+00', ''),
	('00000000-0000-0000-0000-000000000000', '9bc95cfd-25e5-476b-a5b8-8c49f9166d27', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 05:17:27.843839+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c25ad097-1842-4ef2-b9ac-574326f027c2', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-09 05:21:34.809307+00', ''),
	('00000000-0000-0000-0000-000000000000', '771e5f49-674f-47f1-aa5b-db9b95ead2d8', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 06:19:52.006694+00', ''),
	('00000000-0000-0000-0000-000000000000', '54a55c6a-89ff-48b0-9ab6-647ff1507072', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 06:19:52.007429+00', ''),
	('00000000-0000-0000-0000-000000000000', '10b86106-1aee-4f83-90b3-539f9aee5a55', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 17:07:32.700315+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f66c1ae6-c3c5-4b22-98ff-c06c1e097a64', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 17:07:32.701935+00', ''),
	('00000000-0000-0000-0000-000000000000', '9bea675b-3aac-4456-a732-82bc06e7bac9', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 20:10:15.035806+00', ''),
	('00000000-0000-0000-0000-000000000000', '7247569c-2b17-4c22-a9f2-d9f0f3ccad85', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 20:10:15.037282+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b316c699-d945-4b52-9057-171ea554d7ba', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 20:10:19.152112+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb71756e-db8f-4fc7-ab81-3d3307b5f237', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 20:10:19.308454+00', ''),
	('00000000-0000-0000-0000-000000000000', '26a33750-a2be-45f1-8ef2-14eccfbb79dc', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 21:08:31.330832+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cc41586-a928-42cd-8c96-5e3afb8221f5', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 21:08:31.331604+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f106b3e-59c3-4c8b-a6a9-beaf52806bb4', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 22:06:32.610802+00', ''),
	('00000000-0000-0000-0000-000000000000', 'daee1a11-ad26-4ecc-9d13-75431b93e5fa', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 22:06:32.612006+00', ''),
	('00000000-0000-0000-0000-000000000000', '2dda6260-b39b-472f-a64a-eb2ad9c0cd56', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 23:21:45.672397+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d856989-746c-4862-b9dd-d8799b12fbf8', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-09 23:21:45.673122+00', ''),
	('00000000-0000-0000-0000-000000000000', '65d351a4-f526-435d-9039-88c29d75ccf3', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 00:22:03.672073+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c57be0a2-d6a1-4f4f-8cfd-cd5f8b8a50f1', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 00:22:03.678419+00', ''),
	('00000000-0000-0000-0000-000000000000', '662e274e-e07d-4190-b1b6-27e60619b167', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 20:30:04.864875+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af30af9e-c825-4aac-bcb4-b87787f15631', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 20:30:04.866022+00', ''),
	('00000000-0000-0000-0000-000000000000', '76e38035-8f11-4a5c-b14b-cac06c27be84', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-10 20:31:48.699904+00', ''),
	('00000000-0000-0000-0000-000000000000', '1901b08a-7c0c-4470-a64f-bf8b6ad1490b', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 21:30:07.606997+00', ''),
	('00000000-0000-0000-0000-000000000000', '79a0618b-f302-4587-b4d7-7e4b077d9f14', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 21:30:07.607742+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4a07593-1703-4b72-984b-969bac3d0ff0', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 22:28:18.690176+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb85e1c6-d7a3-42d5-adff-184603d2a3d5', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 22:28:18.692181+00', ''),
	('00000000-0000-0000-0000-000000000000', '28b76f17-6641-4e6e-ac3d-7181f42d80f3', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 23:26:31.111299+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f58cef8f-6b4f-4e1a-ab2d-f4cd6c31cba9', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 23:26:31.112494+00', ''),
	('00000000-0000-0000-0000-000000000000', '14bd99e5-d868-49dd-a0c5-17321724545b', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-11 00:24:44.924707+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d3202a0-1ef8-4875-89c2-838709cbd442', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-11 00:24:44.926265+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e9b27d3-235f-495f-bd05-8aa1a7d9280e', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-11 16:11:39.134087+00', ''),
	('00000000-0000-0000-0000-000000000000', '9751c616-43b8-402b-82cf-37780922a64f', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-11 16:11:39.14203+00', ''),
	('00000000-0000-0000-0000-000000000000', '51405309-3ad0-4b8e-b0d4-1628b02416b5', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-11 22:16:25.460811+00', ''),
	('00000000-0000-0000-0000-000000000000', '162fe784-e32b-4d8c-a5b9-4fbfcbe6ffe8', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-11 22:16:25.464902+00', ''),
	('00000000-0000-0000-0000-000000000000', '10285c29-b0cc-46a4-842b-2ee747bf7881', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-11 22:18:12.596828+00', ''),
	('00000000-0000-0000-0000-000000000000', '25cd965e-28a8-46b0-9774-aa773850b7d1', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-11 23:16:30.615272+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ab95645-d843-4ff2-9495-a921c78d5231', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-11 23:16:30.61676+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7aec54f-9619-46cd-b66e-43ff3fdf585d', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 17:26:30.93782+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd1d5945a-f2ac-496f-af4b-dd482c40915a', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 17:26:30.939402+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6333efe-a99f-4134-8959-e0ccc1f7e206', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-12 17:26:42.339629+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ce37c0e-244c-43f8-9c7d-499a59521a26', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 18:25:19.209308+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6530184-5231-4cdb-8297-d64c30874722', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 18:25:19.211424+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6cf8de2-99c0-488c-b609-4e8dcb5f5120', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 20:00:55.298452+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb3cc64c-4ca6-405f-94a4-9ea224cde6bf', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 20:00:55.301265+00', ''),
	('00000000-0000-0000-0000-000000000000', '978adda7-1c01-44d0-8488-d5c284009552', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 20:01:11.814015+00', ''),
	('00000000-0000-0000-0000-000000000000', '46952c26-0d03-4d9c-b41c-b755fbf14df0', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 20:59:35.378817+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eae53a0f-d764-4102-83d5-9103ee7ba487', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 20:59:35.379249+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6af2cba-32df-40b1-bdad-f63cf3217f59', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 21:57:35.171583+00', ''),
	('00000000-0000-0000-0000-000000000000', '862d00bb-0bcf-478b-81bc-c8ea5a8dc323', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 21:57:35.172135+00', ''),
	('00000000-0000-0000-0000-000000000000', '6568b8a7-bf82-4238-b28b-41fce459bc37', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 23:02:49.442171+00', ''),
	('00000000-0000-0000-0000-000000000000', '43983619-4df2-4f96-95ff-5e609e90b122', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 23:02:49.447641+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de57a7c3-deaa-4c82-b1c9-3beb58b811b8', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 23:02:49.509589+00', ''),
	('00000000-0000-0000-0000-000000000000', '08642223-3fa1-4266-becb-1b6e291f949b', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 23:02:52.595949+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d4413b6-8f6d-450f-9f6a-8e8b0217b3d1', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 00:01:06.627654+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0f39ef8-7527-4a8c-8df9-bbe7469aa352', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 00:01:06.628424+00', ''),
	('00000000-0000-0000-0000-000000000000', '0522f4a5-09c2-4114-86e9-5cf60b8605d8', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 01:04:04.897721+00', ''),
	('00000000-0000-0000-0000-000000000000', '164d1572-227c-46a9-9abc-d4bd1de0a4d2', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 01:04:04.902909+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a45e05a2-4e92-4a1b-a26e-7bd629cbd0f9', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 16:54:54.972972+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b0e4027-5fd9-4e39-ac47-9f7c0e370830', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 16:54:54.977118+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f9c4dea3-32e3-44a6-8a7a-566fb92a54e7', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 18:26:37.487354+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bbe4e1d0-f7ef-429b-9b92-b39b982cc262', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 18:26:37.49776+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e211afa5-cd3e-4e0b-a8d8-3df21778389c', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 18:26:37.54109+00', ''),
	('00000000-0000-0000-0000-000000000000', '47ecb6f3-2e86-4270-baa7-787ac7056551', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 18:26:40.400186+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a9a43a1-37f5-46f3-b9f6-267352ff8c38', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 19:24:41.240527+00', ''),
	('00000000-0000-0000-0000-000000000000', '47169413-57a1-4d53-b5b2-3e953ca87fba', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 19:24:41.241208+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f80dc8c6-ed9b-4e40-bc06-dadca24bf93f', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 20:23:17.444625+00', ''),
	('00000000-0000-0000-0000-000000000000', '77fa947a-9ba2-41f6-bc26-1db5dd62a1ce', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 20:23:17.447839+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e67b62b9-ea86-4c80-965d-c5d1cbe6e90d', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 21:28:09.149315+00', ''),
	('00000000-0000-0000-0000-000000000000', '4794e05a-a77e-4e55-99ff-9e25eafef6ca', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 21:28:09.153803+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d18ce26-7ad5-4446-a511-3dc66d490b0b', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 22:26:25.53788+00', ''),
	('00000000-0000-0000-0000-000000000000', '860e0f1d-0edd-4867-ac5d-f1ae7aa31974', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 22:26:25.541095+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7ba4cbb-c09b-4bca-a507-8a79b827d785', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 23:24:53.790986+00', ''),
	('00000000-0000-0000-0000-000000000000', '163243dd-f10c-4641-aa8d-1647cc95c735', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-13 23:24:53.792034+00', ''),
	('00000000-0000-0000-0000-000000000000', '94e9af22-d1e9-42ce-812c-084b35d33ccf', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-14 20:08:08.578011+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4f2f875-12cf-4e58-bf81-2cda62d574e9', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-14 20:08:08.582511+00', ''),
	('00000000-0000-0000-0000-000000000000', '075f7bee-5aa5-4ec1-874b-8dd3fad698ac', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-14 20:38:39.008832+00', ''),
	('00000000-0000-0000-0000-000000000000', '182c5c88-d4c3-4e6c-b260-1c050d459c9c', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-14 21:37:06.761475+00', ''),
	('00000000-0000-0000-0000-000000000000', '21f09ce8-ca56-46eb-90ed-e38cfd1f5c1c', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-14 21:37:06.764246+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b819c1a0-c7be-4d96-a88a-c95639579f65', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-15 18:00:53.903884+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f037a52-4f13-4409-a664-af95510141ae', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-15 18:00:53.913177+00', ''),
	('00000000-0000-0000-0000-000000000000', '698865ff-9cc3-4219-ac7e-71c56ef29854', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 18:10:15.655438+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8b09127-372d-4a15-a373-5fb62a070d35', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 18:10:15.66391+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b353a80-c665-4347-ab50-2222d616fd50', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-16 18:28:28.151315+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba5d11fa-c973-4f63-baea-7154a754d2d2', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 19:41:21.206952+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f642620b-ddab-4219-a36e-a71601183af6', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 19:41:21.207721+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2da8ddf-ab24-41b3-b14d-4323f197c2fc', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 19:41:21.387301+00', ''),
	('00000000-0000-0000-0000-000000000000', '76aec14a-6ed6-4ba3-a8d7-a98464a44106', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 19:41:21.639729+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8d321ba-10c0-4165-be8c-3d7d9988c713', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 19:41:21.651489+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f93dcd4-6ade-4905-b763-d178fb3cd9c4', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 19:41:22.921533+00', ''),
	('00000000-0000-0000-0000-000000000000', '16afc619-1775-4492-999e-462c60721c5d', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 20:43:36.508265+00', ''),
	('00000000-0000-0000-0000-000000000000', '821669b2-274f-4fde-8d02-c73d9ecfa2f2', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 20:43:36.511881+00', ''),
	('00000000-0000-0000-0000-000000000000', '870e7d62-ffe8-4a61-a2da-5f72dd2c8af6', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 22:07:14.294993+00', ''),
	('00000000-0000-0000-0000-000000000000', '69759e1a-31dc-4849-8a1b-a6613975894f', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 22:07:14.296003+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a12307c-4ccc-4195-828a-4569b39284bd', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 22:07:14.33788+00', ''),
	('00000000-0000-0000-0000-000000000000', '92dd2702-44ee-4c0e-9339-4fe148408dec', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 22:07:16.386894+00', ''),
	('00000000-0000-0000-0000-000000000000', '04d94f78-f09b-4630-a8cf-54241a212b0c', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 22:07:16.401029+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b166df2e-f9df-4178-8587-63aa66407ba9', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 22:07:22.667872+00', ''),
	('00000000-0000-0000-0000-000000000000', '022b4629-a438-4e63-902c-24d070801048', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 23:08:57.80566+00', ''),
	('00000000-0000-0000-0000-000000000000', '2dc0a0fc-86b9-4794-a661-d4b3f233cf99', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-16 23:08:57.807938+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac0c9c58-ef24-4a75-8d7e-56114c9142c2', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 00:07:19.443709+00', ''),
	('00000000-0000-0000-0000-000000000000', '24ba8e4a-d1b0-4955-9080-77acda267011', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 00:07:19.448216+00', ''),
	('00000000-0000-0000-0000-000000000000', '5da84196-a212-4ad6-9ab1-4001b7b85fba', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 17:10:38.600635+00', ''),
	('00000000-0000-0000-0000-000000000000', '4cd203d0-5ee0-479d-af79-1dc0b2c89716', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 17:10:38.611033+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ebe8c347-81e7-4e88-aaf1-4e78a7a28f2c', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-17 17:59:47.779116+00', ''),
	('00000000-0000-0000-0000-000000000000', '17fe7d9c-2c7c-4ef3-b1fd-dfff2fa618fa', '{"action":"logout","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-12-17 18:05:07.902859+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd500e3c2-4d6e-42f2-a3f8-3fdec0c8e4d6', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-17 18:18:21.513692+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a6b95d2-bb18-4800-9d81-1d6db498a067', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 21:08:02.298399+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ca551df-9f73-4b27-af55-742a1ae452a2', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 21:08:02.301719+00', ''),
	('00000000-0000-0000-0000-000000000000', '36dd6e38-cd11-4617-9b42-bbec06dc3a9e', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 21:08:02.637617+00', ''),
	('00000000-0000-0000-0000-000000000000', '117da4b3-f366-4a14-97fd-366acd2537c9', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 21:08:02.751845+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a9e14ca-1492-4f96-80c8-dd418445fe54', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 21:08:07.023624+00', ''),
	('00000000-0000-0000-0000-000000000000', '07987124-eef4-457e-b678-9d5c0cb4de58', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 22:06:36.420336+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd53afcd-665a-42d9-9440-043e2da41042', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 22:06:36.4229+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ffae7ae4-baca-46ed-a93f-7a2f8ed77fa2', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 23:17:55.905534+00', ''),
	('00000000-0000-0000-0000-000000000000', '47492d63-184f-46bc-b5bd-6640a141ad2c', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 23:17:55.906423+00', ''),
	('00000000-0000-0000-0000-000000000000', '065c510d-5d47-4131-866c-602d935b87d2', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 00:15:57.620824+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb5862fd-62aa-48b8-887e-d18f7ea1482d', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 00:15:57.621543+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a863bfb-befd-4ead-9400-5cc6489288e5', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-18 00:40:40.701151+00', ''),
	('00000000-0000-0000-0000-000000000000', '4adce5bf-25a4-4dc8-a946-3739f8c85716', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 01:16:46.494557+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db6f0eef-cf7b-4cc2-b4e5-f9c1d7d99ece', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 01:16:46.498165+00', ''),
	('00000000-0000-0000-0000-000000000000', '608d1ce5-e189-4601-8856-01517f9210bf', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 16:57:57.8863+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b700759-a991-4542-80d2-819397ef14a4', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 16:57:57.889185+00', ''),
	('00000000-0000-0000-0000-000000000000', '93ec895b-813c-4375-b925-7ce0c0eb9d34', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-18 16:58:34.822343+00', ''),
	('00000000-0000-0000-0000-000000000000', '81b42c86-a5a2-4891-b3c9-abbd46e6732d', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 17:56:53.110843+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ce57173-0dd7-42d1-8c92-6932539ec833', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 17:56:53.112746+00', ''),
	('00000000-0000-0000-0000-000000000000', '00533d6d-70c4-4861-97d4-9c67f20209ba', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 18:54:53.229594+00', ''),
	('00000000-0000-0000-0000-000000000000', '3febab6c-3883-40e0-b4c9-2b8fffe2462f', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 18:54:53.232063+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9e196d5-bcf1-4d0d-87b9-58dd8a201eb1', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 20:06:09.490929+00', ''),
	('00000000-0000-0000-0000-000000000000', '03cfbeae-9e6c-4eac-827e-bc1735d92139', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 20:06:09.49651+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c70a5db-af37-4f3c-ac85-8fab84e278e5', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 21:04:22.193217+00', ''),
	('00000000-0000-0000-0000-000000000000', '020f801b-ed40-4b20-9b6f-c6c25bbe24e5', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 21:04:22.196273+00', ''),
	('00000000-0000-0000-0000-000000000000', '31476b36-8c31-4e31-9518-5687103ab333', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 22:02:22.245059+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a88cf6f-f8b1-4142-b5a8-03116fc29476', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 22:02:22.246362+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b36af539-3744-4e66-9631-fb8e69783f72', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 23:15:55.979758+00', ''),
	('00000000-0000-0000-0000-000000000000', '41d39520-6398-4421-bec1-8e9833247cb4', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 23:15:55.983155+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c959eea1-0e3d-40ae-b650-c15134d2d7b5', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 23:15:56.016361+00', ''),
	('00000000-0000-0000-0000-000000000000', '94e1fbe7-d261-4250-8caf-bfd373e005b7', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-18 23:16:05.543827+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d5e0984-d925-4fc6-8acf-850a61c02d7d', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-19 00:17:54.904744+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a766d67e-3333-4eb3-9b1f-ce7380d5f9c9', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-19 00:17:54.909198+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d95dfba-5605-4420-9a32-37602d63d049', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-19 17:18:22.745725+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ef87aac-67de-477c-b64b-f7d7cf8de0eb', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-19 17:18:22.753625+00', ''),
	('00000000-0000-0000-0000-000000000000', '6fe6d380-17e4-4c81-a22e-4b33f4c5407b', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-19 20:13:20.56311+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f150912-158d-4b77-a0f3-5b3859ef90ae', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-19 20:13:20.574533+00', ''),
	('00000000-0000-0000-0000-000000000000', '41e3e567-c14b-404e-a0f8-5e6155cc97b4', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-19 20:13:44.728736+00', ''),
	('00000000-0000-0000-0000-000000000000', '82f09ebf-47bc-4407-a22b-2fb00d0a1240', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-19 21:51:34.157653+00', ''),
	('00000000-0000-0000-0000-000000000000', '3baa6e58-96fd-4e8f-b42a-f54dedf33070', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-19 21:51:34.171148+00', ''),
	('00000000-0000-0000-0000-000000000000', '68b2bfc3-9b59-4583-8619-3240b37608b0', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 00:04:12.428483+00', ''),
	('00000000-0000-0000-0000-000000000000', '09651c84-dfc2-44fb-b05d-a218655b9157', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 00:04:12.433061+00', ''),
	('00000000-0000-0000-0000-000000000000', '17fe48c3-452a-4b48-aab3-44ada1613f71', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 01:02:16.789346+00', ''),
	('00000000-0000-0000-0000-000000000000', '8405890a-48f5-4040-95a5-63275ca10436', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 01:02:16.792858+00', ''),
	('00000000-0000-0000-0000-000000000000', '66731a81-373c-4126-8f83-39a3370197d0', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 17:06:49.678544+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aba246da-5f55-46bb-ae2e-6874aa52ff1b', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 17:06:49.683213+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b81ea375-5c7f-40df-8a35-40e6e5f1a5b9', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 18:35:13.407921+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c0d75ff-99d5-462c-9a38-a14bf0f888bf', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 18:35:13.409429+00', ''),
	('00000000-0000-0000-0000-000000000000', '7aba7b86-0142-48e4-87e8-7ff313be3d1e', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-20 18:35:19.05672+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f1fa1d9-d600-4a3e-a926-d509de07f0cb', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 19:33:33.881316+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2bed37b-8128-4a4a-a869-056e5c1879b3', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 19:33:33.884776+00', ''),
	('00000000-0000-0000-0000-000000000000', '547c1cf9-855f-429e-8812-a62c6147beeb', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 20:44:18.007036+00', ''),
	('00000000-0000-0000-0000-000000000000', '293535e1-4916-4714-ae9f-fa750a4ff704', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 20:44:18.00994+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ddaac16-28c6-4cb9-b0a0-ca49ea83c2df', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 21:42:32.962758+00', ''),
	('00000000-0000-0000-0000-000000000000', '3272ec2d-9c2a-4a88-8e9f-9a1ff7dbf538', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 21:42:32.96515+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c058a9f9-d3b1-4e8e-8ee3-7bae770c1750', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 22:40:45.299277+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f119cead-a60e-4207-9e56-6abc7cd2aff0', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 22:40:45.301836+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec04068a-814d-428d-9cf6-31f5f803e4b4', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 23:53:56.35727+00', ''),
	('00000000-0000-0000-0000-000000000000', '821a3291-7ec0-4e58-af9d-6abe7fd6db2f', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 23:53:56.366739+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f69a6a0-c617-4991-8fd9-6fae1cd3d53b', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-21 01:00:07.100177+00', ''),
	('00000000-0000-0000-0000-000000000000', '904cb9da-2bbc-4419-8e23-714e11e6f8ce', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-21 01:00:07.104721+00', ''),
	('00000000-0000-0000-0000-000000000000', '8496aff6-6b6a-4c71-a97e-3281de5089f6', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-21 02:02:25.643999+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f148e3d8-a9bf-49a4-b2cf-9985dc3a795b', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-21 02:02:25.65343+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e944704-9892-43b2-9944-3208d85cfebf', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-22 19:06:14.305887+00', ''),
	('00000000-0000-0000-0000-000000000000', '2fa1ba5a-b652-4a02-978d-d29410c530a7', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-22 19:06:14.315158+00', ''),
	('00000000-0000-0000-0000-000000000000', '404bfa0b-b887-4b7d-9ac8-c121f5285c44', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-22 19:08:20.846422+00', ''),
	('00000000-0000-0000-0000-000000000000', '79f16fed-bb0f-47f9-b07c-657f8fa147b6', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-22 20:06:20.335243+00', ''),
	('00000000-0000-0000-0000-000000000000', '090dad85-ad69-4c20-b374-e786316fb69f', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-22 20:06:20.337252+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c026cc94-1aed-47dc-9c1b-cb1e76eb7a1b', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-30 22:43:07.094818+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6736ae4-0291-4841-aeaa-cdfbcc6de80f', '{"action":"login","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-30 22:43:39.66133+00', ''),
	('00000000-0000-0000-0000-000000000000', '82c11c58-ff0b-4c4b-b37e-ea17d5861b15', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-30 23:50:55.596742+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1f4207a-6ac8-4448-992d-6a6d143dc4f3', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-30 23:50:55.598941+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c294d24-9d14-4eac-9d40-1b532c30dc15', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 00:50:48.922334+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e229e3f7-07c9-4909-931e-a886689554e1', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 00:50:48.925922+00', ''),
	('00000000-0000-0000-0000-000000000000', '85e98b31-5758-4af5-947d-6d7ab90ad4e8', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 01:51:13.360688+00', ''),
	('00000000-0000-0000-0000-000000000000', '278fd734-fa3b-4fab-b66b-ad32b8710f2f', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 01:51:13.36198+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad096bd0-e779-44cc-bffc-aa0638079a98', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 03:03:58.33134+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f221b79c-4f21-426d-9318-7db059dc901f', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 03:03:58.331894+00', ''),
	('00000000-0000-0000-0000-000000000000', '768738d4-c128-4f9d-8f9d-42c529ac7ae2', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 04:04:08.154206+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0895633-8bd3-48c1-be3a-b4b1f28952d8', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 04:04:08.155709+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e0daac6-d02c-4643-9f6f-899e48c9e44c', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 05:04:12.092052+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af2a77a0-b256-421f-9cec-7461a22ccde5', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 05:04:12.092732+00', ''),
	('00000000-0000-0000-0000-000000000000', '93ef1ade-71fb-4f8a-a38b-1c04ff87078e', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 06:04:52.852619+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a890ad1-cca8-4db1-a39d-66412362841a', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 06:04:52.853284+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a3274a6-18ee-4b13-8b38-1f599103004c', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 07:16:26.311387+00', ''),
	('00000000-0000-0000-0000-000000000000', '67d71255-470a-4da3-9598-8db947530af0', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 07:16:26.312619+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc72103b-f554-4101-8c4c-af12da2d59a6', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 08:16:58.531048+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed17c6df-60ec-49f5-9338-7ce8f1281281', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 08:16:58.53184+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c981f8e8-edbb-4f00-b2b7-a2a01f5da1d1', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 09:09:48.039988+00', ''),
	('00000000-0000-0000-0000-000000000000', '3366e25e-697e-4fa8-90bd-11b23401fe12', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 09:09:48.040606+00', ''),
	('00000000-0000-0000-0000-000000000000', '04b77a27-4557-43b3-90ad-922b82de3a1b', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 10:14:45.250944+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b307cc8-d696-4ff4-b9dd-be453a83c485', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 10:14:45.25155+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8905895-9952-490e-9f29-5572afb4e82a', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 11:23:13.559217+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a98d582-4b0d-4a75-abed-58bae26e7460', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 11:23:13.559968+00', ''),
	('00000000-0000-0000-0000-000000000000', '52663edc-b907-4849-b9bb-bd4d3b240089', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 12:31:09.2565+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2b0d1c1-f333-4013-89a6-1f4ebafc3385', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 12:31:09.257143+00', ''),
	('00000000-0000-0000-0000-000000000000', '3569dac7-89f6-43c9-ab19-0a933ceed58c', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 13:45:57.98228+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ba9f219-1f80-4ba5-9bb3-f80f50edf3d2', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 13:45:57.982973+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb16b388-04e2-4579-ae86-5dadf0c5908a', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 14:46:06.086623+00', ''),
	('00000000-0000-0000-0000-000000000000', '348e415d-96ee-4be4-90b2-695da27b4a92', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 14:46:06.08733+00', ''),
	('00000000-0000-0000-0000-000000000000', '81892cb9-e156-40ae-b8c0-79770c93423a', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 15:48:46.972997+00', ''),
	('00000000-0000-0000-0000-000000000000', '82aa4055-c80f-4a8a-8110-33074145eb9c', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 15:48:46.973812+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2cf0033-6c99-4e36-ab3d-7e43ea31c003', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 16:48:50.937483+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b62019e2-beeb-4120-bc40-85800cc8d09f', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 16:48:50.938119+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c8d34a9-ec3a-47fd-9bc6-b30e85fc38dc', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 17:49:14.971995+00', ''),
	('00000000-0000-0000-0000-000000000000', '706053e6-18f6-4ccb-be57-15a326a0fda1', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 17:49:14.974319+00', ''),
	('00000000-0000-0000-0000-000000000000', '768fc55d-4ad9-4859-98bc-6a2d796af292', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 18:49:41.971198+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a15fa9c-c334-48ee-af0b-b85940fad8ac', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 18:49:41.971994+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a95b203-3646-44af-999a-0fa46578fa00', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 19:48:03.890912+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d9b0dc2-657d-4d11-a453-8dbed2d5896b', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-31 19:48:03.896069+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf95f038-971c-4008-adbc-e4dae6322fe4', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-03 19:41:31.438294+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4dabe06-88c6-43d4-a3cf-6c4c5a44c574', '{"action":"token_revoked","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-03 19:41:31.449229+00', ''),
	('00000000-0000-0000-0000-000000000000', '009d4aa5-45e4-46da-bcbe-4d2c6a5b82b2', '{"action":"token_refreshed","actor_id":"0e803be6-3911-40f7-bdf4-9a4a2bff2ddf","actor_username":"jimmiejackson414@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-03 19:41:31.541329+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'service_role', 'service_role', 'admin@gearcloset.com', '$2a$06$DN3V9R3eHUZD0vR.xZl08.WJWGLcMJ7/z7/kNM0ZYssiPdXrlnHVq', '2024-12-08 20:39:55.426509+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', true, '2024-12-08 20:39:55.426509+00', '2024-12-08 20:39:55.426509+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', 'authenticated', 'authenticated', 'jimmiejackson414@gmail.com', '$2a$06$7Xx9dD9/aC.u5BTQa1mUZeLDv.nvBy2uuq0oGaO2/aOKeJDev.1oa', '2024-12-08 20:39:55.426509+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-30 22:43:39.662045+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '2024-12-08 20:39:55.426509+00', '2025-01-03 19:41:31.464985+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('708dcf04-394f-40b7-bd60-816b4208d0eb', '00000000-0000-0000-0000-000000000000', '{"sub": "00000000-0000-0000-0000-000000000000", "email": "admin@gearcloset.com"}', 'email', '2024-12-08 20:39:55.426509+00', '2024-12-08 20:39:55.426509+00', '2024-12-08 20:39:55.426509+00', '9964120e-ee52-4cc7-9f2c-cb0f652e5861'),
	('648542a0-e010-4ba8-adbf-33d31bd2439b', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '{"sub": "0e803be6-3911-40f7-bdf4-9a4a2bff2ddf", "email": "jimmiejackson414@gmail.com"}', 'email', '2024-12-08 20:39:55.426509+00', '2024-12-08 20:39:55.426509+00', '2024-12-08 20:39:55.426509+00', '578f6a45-f42a-4968-8f22-aeca36a324b1');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('cea142ab-f182-4213-8b2f-a9b818c94f78', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '2024-12-20 18:35:19.057704+00', '2024-12-22 19:06:14.343865+00', NULL, 'aal1', NULL, '2024-12-22 19:06:14.343739', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('55874b05-9d5c-4407-ac51-2d671286a68f', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '2024-12-22 19:08:20.847681+00', '2024-12-22 20:06:20.34251+00', NULL, 'aal1', NULL, '2024-12-22 20:06:20.342465', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('f2e9e920-82a2-4e8d-a462-7428df96dba1', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '2024-12-30 22:43:07.103765+00', '2024-12-30 22:43:07.103765+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('aea4a39c-0695-434c-89f0-d2a9405bd32f', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '2024-12-18 00:40:40.702171+00', '2024-12-18 00:40:40.702171+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('8168b294-a93d-4f5d-a0e1-16566f94e2c8', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '2024-12-17 18:18:21.5175+00', '2024-12-18 16:57:57.893909+00', NULL, 'aal1', NULL, '2024-12-18 16:57:57.893855', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('135139ba-9db6-436e-a570-981450397614', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '2024-12-18 16:58:34.823202+00', '2024-12-19 20:13:20.591819+00', NULL, 'aal1', NULL, '2024-12-19 20:13:20.591764', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('63fb1fff-b441-48b6-9866-0c150662ca8b', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '2024-12-19 20:13:44.730043+00', '2024-12-20 18:35:13.412314+00', NULL, 'aal1', NULL, '2024-12-20 18:35:13.412284', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '172.18.0.1', NULL),
	('1dda3b40-bba0-4686-a40e-e55d3cae1c74', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '2024-12-30 22:43:39.662095+00', '2025-01-03 19:41:31.544172+00', NULL, 'aal1', NULL, '2025-01-03 19:41:31.544133', 'node', '172.18.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('8168b294-a93d-4f5d-a0e1-16566f94e2c8', '2024-12-17 18:18:21.521757+00', '2024-12-17 18:18:21.521757+00', 'password', '7ffc8ef6-25c6-4cb0-9a78-52e2e3f43f0e'),
	('aea4a39c-0695-434c-89f0-d2a9405bd32f', '2024-12-18 00:40:40.704623+00', '2024-12-18 00:40:40.704623+00', 'password', '24ccef4b-d6dd-42dc-85e0-65c53066f1b4'),
	('135139ba-9db6-436e-a570-981450397614', '2024-12-18 16:58:34.825919+00', '2024-12-18 16:58:34.825919+00', 'password', '4ab4ff8d-8e76-4cbf-ae7e-0f463ae3e4ff'),
	('63fb1fff-b441-48b6-9866-0c150662ca8b', '2024-12-19 20:13:44.736116+00', '2024-12-19 20:13:44.736116+00', 'password', '76f23112-f217-4d72-9ea5-9cb875ec2f42'),
	('cea142ab-f182-4213-8b2f-a9b818c94f78', '2024-12-20 18:35:19.063054+00', '2024-12-20 18:35:19.063054+00', 'password', '3aac8caf-b21a-412b-a514-370fa3750211'),
	('55874b05-9d5c-4407-ac51-2d671286a68f', '2024-12-22 19:08:20.85242+00', '2024-12-22 19:08:20.85242+00', 'password', '8ec4d7b6-6ab2-4e0a-a806-592de5b10efb'),
	('f2e9e920-82a2-4e8d-a462-7428df96dba1', '2024-12-30 22:43:07.125467+00', '2024-12-30 22:43:07.125467+00', 'password', 'fc0539bd-88cd-4736-a50f-7a579e162fa3'),
	('1dda3b40-bba0-4686-a40e-e55d3cae1c74', '2024-12-30 22:43:39.663697+00', '2024-12-30 22:43:39.663697+00', 'password', '84da423f-f815-4ba5-9b8e-fac3ffd69acb');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 51, '9ZSB_Zmhtv0qXad8BYdV-Q', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-17 18:18:21.519382+00', '2024-12-17 21:08:02.303383+00', NULL, '8168b294-a93d-4f5d-a0e1-16566f94e2c8'),
	('00000000-0000-0000-0000-000000000000', 52, 'PZA8b8VNc0fWcaDWPSJhqQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-17 21:08:02.307952+00', '2024-12-17 22:06:36.423248+00', '9ZSB_Zmhtv0qXad8BYdV-Q', '8168b294-a93d-4f5d-a0e1-16566f94e2c8'),
	('00000000-0000-0000-0000-000000000000', 53, 'mEIh9wrWDrMX7HkaeRm5wA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-17 22:06:36.425862+00', '2024-12-17 23:17:55.906648+00', 'PZA8b8VNc0fWcaDWPSJhqQ', '8168b294-a93d-4f5d-a0e1-16566f94e2c8'),
	('00000000-0000-0000-0000-000000000000', 54, '6XT98yhfNE1ageHX5CJ0KQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-17 23:17:55.90716+00', '2024-12-18 00:15:57.621785+00', 'mEIh9wrWDrMX7HkaeRm5wA', '8168b294-a93d-4f5d-a0e1-16566f94e2c8'),
	('00000000-0000-0000-0000-000000000000', 56, 'WoIF5rZcyU7v5yzKuvUZaw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', false, '2024-12-18 00:40:40.703702+00', '2024-12-18 00:40:40.703702+00', NULL, 'aea4a39c-0695-434c-89f0-d2a9405bd32f'),
	('00000000-0000-0000-0000-000000000000', 55, 'mRQrJ_fjOFdXD86WmOFfbw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-18 00:15:57.622404+00', '2024-12-18 01:16:46.49846+00', '6XT98yhfNE1ageHX5CJ0KQ', '8168b294-a93d-4f5d-a0e1-16566f94e2c8'),
	('00000000-0000-0000-0000-000000000000', 57, 'IS_h2ZOicFWvlt2R2x7ahQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-18 01:16:46.502463+00', '2024-12-18 16:57:57.890381+00', 'mRQrJ_fjOFdXD86WmOFfbw', '8168b294-a93d-4f5d-a0e1-16566f94e2c8'),
	('00000000-0000-0000-0000-000000000000', 58, 'NKL7q8wkgz_QtEgGFeIg5Q', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', false, '2024-12-18 16:57:57.891763+00', '2024-12-18 16:57:57.891763+00', 'IS_h2ZOicFWvlt2R2x7ahQ', '8168b294-a93d-4f5d-a0e1-16566f94e2c8'),
	('00000000-0000-0000-0000-000000000000', 59, 'eGV0pSmsSpVtSgFktWJEQg', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-18 16:58:34.824927+00', '2024-12-18 17:56:53.112961+00', NULL, '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 60, '8GQZduZATvSSH25IiOOpvA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-18 17:56:53.116278+00', '2024-12-18 18:54:53.234664+00', 'eGV0pSmsSpVtSgFktWJEQg', '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 61, 'A4yA0a4lcYPUyNp8d9wuUA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-18 18:54:53.235659+00', '2024-12-18 20:06:09.497121+00', '8GQZduZATvSSH25IiOOpvA', '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 62, 'qRMmN7SOz3_jP8lMeDP53g', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-18 20:06:09.497887+00', '2024-12-18 21:04:22.196609+00', 'A4yA0a4lcYPUyNp8d9wuUA', '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 63, 'UamQqI7lD0zqP6aLrdZpQg', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-18 21:04:22.198565+00', '2024-12-18 22:02:22.246756+00', 'qRMmN7SOz3_jP8lMeDP53g', '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 64, 'uOp0yeJ7AWMKH4f9HNTTlw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-18 22:02:22.247573+00', '2024-12-18 23:15:55.983387+00', 'UamQqI7lD0zqP6aLrdZpQg', '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 65, 'LKTODLJ673wYQOk-Y_atQA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-18 23:15:55.987517+00', '2024-12-19 00:17:54.909816+00', 'uOp0yeJ7AWMKH4f9HNTTlw', '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 66, 'rPSLSkVhhwv1547BxJNtbQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-19 00:17:54.914612+00', '2024-12-19 17:18:22.754491+00', 'LKTODLJ673wYQOk-Y_atQA', '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 67, '8HraTSdXWD_MLSxZu3UZ2w', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-19 17:18:22.761447+00', '2024-12-19 20:13:20.576139+00', 'rPSLSkVhhwv1547BxJNtbQ', '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 68, '-yzSSRo-1InhCIlK6au8tQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', false, '2024-12-19 20:13:20.582141+00', '2024-12-19 20:13:20.582141+00', '8HraTSdXWD_MLSxZu3UZ2w', '135139ba-9db6-436e-a570-981450397614'),
	('00000000-0000-0000-0000-000000000000', 69, 'C5ufqtANiIxQBUSPgbydRw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-19 20:13:44.733773+00', '2024-12-19 21:51:34.171855+00', NULL, '63fb1fff-b441-48b6-9866-0c150662ca8b'),
	('00000000-0000-0000-0000-000000000000', 70, 'gvkykrxLSn8LoYZ2KGdvdw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-19 21:51:34.181752+00', '2024-12-20 00:04:12.433295+00', 'C5ufqtANiIxQBUSPgbydRw', '63fb1fff-b441-48b6-9866-0c150662ca8b'),
	('00000000-0000-0000-0000-000000000000', 71, 'bmlWLZpvQLRGZBqCVGH_cw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-20 00:04:12.436173+00', '2024-12-20 01:02:16.793213+00', 'gvkykrxLSn8LoYZ2KGdvdw', '63fb1fff-b441-48b6-9866-0c150662ca8b'),
	('00000000-0000-0000-0000-000000000000', 72, '5vB9mzbPO13djii3H2wVAg', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-20 01:02:16.795511+00', '2024-12-20 17:06:49.683474+00', 'bmlWLZpvQLRGZBqCVGH_cw', '63fb1fff-b441-48b6-9866-0c150662ca8b'),
	('00000000-0000-0000-0000-000000000000', 73, 'Jivk3msQ9pmxltRlrgH0aQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-20 17:06:49.686363+00', '2024-12-20 18:35:13.409765+00', '5vB9mzbPO13djii3H2wVAg', '63fb1fff-b441-48b6-9866-0c150662ca8b'),
	('00000000-0000-0000-0000-000000000000', 74, 'hCtgWOajSyQswJFVcVIEQw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', false, '2024-12-20 18:35:13.410537+00', '2024-12-20 18:35:13.410537+00', 'Jivk3msQ9pmxltRlrgH0aQ', '63fb1fff-b441-48b6-9866-0c150662ca8b'),
	('00000000-0000-0000-0000-000000000000', 75, 'ol3R51DI2MFFjxPtMaLCIw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-20 18:35:19.060878+00', '2024-12-20 19:33:33.885052+00', NULL, 'cea142ab-f182-4213-8b2f-a9b818c94f78'),
	('00000000-0000-0000-0000-000000000000', 76, 'k9uNbrSAVMQxyRGVXvTj4w', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-20 19:33:33.888447+00', '2024-12-20 20:44:18.012436+00', 'ol3R51DI2MFFjxPtMaLCIw', 'cea142ab-f182-4213-8b2f-a9b818c94f78'),
	('00000000-0000-0000-0000-000000000000', 77, 'ZHszS5k1sj6jv6x7bPR6lA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-20 20:44:18.017808+00', '2024-12-20 21:42:32.965346+00', 'k9uNbrSAVMQxyRGVXvTj4w', 'cea142ab-f182-4213-8b2f-a9b818c94f78'),
	('00000000-0000-0000-0000-000000000000', 78, 'osZTA4EFClT1rptUJGjsww', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-20 21:42:32.967897+00', '2024-12-20 22:40:45.302106+00', 'ZHszS5k1sj6jv6x7bPR6lA', 'cea142ab-f182-4213-8b2f-a9b818c94f78'),
	('00000000-0000-0000-0000-000000000000', 79, 'naPeJvuS1JFmMm3EbdloBg', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-20 22:40:45.304995+00', '2024-12-20 23:53:56.368315+00', 'osZTA4EFClT1rptUJGjsww', 'cea142ab-f182-4213-8b2f-a9b818c94f78'),
	('00000000-0000-0000-0000-000000000000', 80, 'btdpaJqFnGszKyqs9SPWfA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-20 23:53:56.378348+00', '2024-12-21 01:00:07.105124+00', 'naPeJvuS1JFmMm3EbdloBg', 'cea142ab-f182-4213-8b2f-a9b818c94f78'),
	('00000000-0000-0000-0000-000000000000', 81, 'ZLfGCfBJoUYv9p1kQfy5Jw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-21 01:00:07.107969+00', '2024-12-21 02:02:25.654005+00', 'btdpaJqFnGszKyqs9SPWfA', 'cea142ab-f182-4213-8b2f-a9b818c94f78'),
	('00000000-0000-0000-0000-000000000000', 82, 'FPLncz1Coc_hyaPIoUw_Ug', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-21 02:02:25.657979+00', '2024-12-22 19:06:14.317002+00', 'ZLfGCfBJoUYv9p1kQfy5Jw', 'cea142ab-f182-4213-8b2f-a9b818c94f78'),
	('00000000-0000-0000-0000-000000000000', 83, 'PpIuNL6umxhA-5eqEWVcBw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', false, '2024-12-22 19:06:14.32242+00', '2024-12-22 19:06:14.32242+00', 'FPLncz1Coc_hyaPIoUw_Ug', 'cea142ab-f182-4213-8b2f-a9b818c94f78'),
	('00000000-0000-0000-0000-000000000000', 84, 'oCiPy5C-Nxip_2erPthKNg', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-22 19:08:20.851129+00', '2024-12-22 20:06:20.337524+00', NULL, '55874b05-9d5c-4407-ac51-2d671286a68f'),
	('00000000-0000-0000-0000-000000000000', 85, 'sCmqgaMM8XWiP9wzG9jw5A', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', false, '2024-12-22 20:06:20.339106+00', '2024-12-22 20:06:20.339106+00', 'oCiPy5C-Nxip_2erPthKNg', '55874b05-9d5c-4407-ac51-2d671286a68f'),
	('00000000-0000-0000-0000-000000000000', 86, '2nIzzXLTR-grAh2NTEVqyQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', false, '2024-12-30 22:43:07.110143+00', '2024-12-30 22:43:07.110143+00', NULL, 'f2e9e920-82a2-4e8d-a462-7428df96dba1'),
	('00000000-0000-0000-0000-000000000000', 87, '2O9j4vnpk5crNQjbA2XQJA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-30 22:43:39.662663+00', '2024-12-30 23:50:55.599124+00', NULL, '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 88, 'f1MqM9aAtL7Ikxa_1oHLhw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-30 23:50:55.601634+00', '2024-12-31 00:50:48.926483+00', '2O9j4vnpk5crNQjbA2XQJA', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 89, '8fl_EY5jPS_IAE9RpGJwwQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 00:50:48.930696+00', '2024-12-31 01:51:13.362112+00', 'f1MqM9aAtL7Ikxa_1oHLhw', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 90, 'rZlSsvAq91fhieMWl1TwqA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 01:51:13.362971+00', '2024-12-31 03:03:58.332059+00', '8fl_EY5jPS_IAE9RpGJwwQ', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 91, 'qgCKcvyrwHlh7n9M9xEBxA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 03:03:58.332407+00', '2024-12-31 04:04:08.155948+00', 'rZlSsvAq91fhieMWl1TwqA', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 92, 'ZfY7KO3cjg2U9AGYsFnYKQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 04:04:08.156632+00', '2024-12-31 05:04:12.092885+00', 'qgCKcvyrwHlh7n9M9xEBxA', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 93, 'W9geHp3R1mvKbIr6TltbgA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 05:04:12.093336+00', '2024-12-31 06:04:52.853545+00', 'ZfY7KO3cjg2U9AGYsFnYKQ', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 94, '2aRUtOZQucx3dypNnsJu_w', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 06:04:52.85396+00', '2024-12-31 07:16:26.312809+00', 'W9geHp3R1mvKbIr6TltbgA', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 95, 'wEbwSlcsCpm6yCGH9vdyZA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 07:16:26.313296+00', '2024-12-31 08:16:58.53209+00', '2aRUtOZQucx3dypNnsJu_w', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 96, 'LFpQDftfYXX6beJ5gCeDcg', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 08:16:58.532574+00', '2024-12-31 09:09:48.0408+00', 'wEbwSlcsCpm6yCGH9vdyZA', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 97, 'MYjDO1UcplM8bjrL7TNFjw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 09:09:48.041119+00', '2024-12-31 10:14:45.251721+00', 'LFpQDftfYXX6beJ5gCeDcg', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 98, 'prHKQYC6RKQxbE-PmIH9zw', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 10:14:45.252077+00', '2024-12-31 11:23:13.56023+00', 'MYjDO1UcplM8bjrL7TNFjw', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 99, 'tzANRMFZntr3kTcuxC1-iA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 11:23:13.560617+00', '2024-12-31 12:31:09.257372+00', 'prHKQYC6RKQxbE-PmIH9zw', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 100, 'AZ7yk4BFT30MGh3NFLBU0A', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 12:31:09.25778+00', '2024-12-31 13:45:57.98321+00', 'tzANRMFZntr3kTcuxC1-iA', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 101, 'DuVkQZoU5B5SllvllU6etQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 13:45:57.983573+00', '2024-12-31 14:46:06.087583+00', 'AZ7yk4BFT30MGh3NFLBU0A', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 102, '6p4UOnxEs8u8a_XyoQP4MA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 14:46:06.087964+00', '2024-12-31 15:48:46.974047+00', 'DuVkQZoU5B5SllvllU6etQ', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 103, 'ZHlYGKLdHl0vhdQl6S1a6w', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 15:48:46.974459+00', '2024-12-31 16:48:50.938257+00', '6p4UOnxEs8u8a_XyoQP4MA', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 104, '7V-mpuM9DQrJfdxEQnKV0Q', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 16:48:50.938705+00', '2024-12-31 17:49:14.974471+00', 'ZHlYGKLdHl0vhdQl6S1a6w', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 105, '1wDVd1Je8ba6QY7iWl7bkg', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 17:49:14.977546+00', '2024-12-31 18:49:41.972226+00', '7V-mpuM9DQrJfdxEQnKV0Q', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 106, 'M9FgO0VTqaukMZw-0keX9A', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 18:49:41.972695+00', '2024-12-31 19:48:03.896237+00', '1wDVd1Je8ba6QY7iWl7bkg', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 107, 'BQ8gheMQ43mTYqrkq3GguA', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', true, '2024-12-31 19:48:03.899844+00', '2025-01-03 19:41:31.45176+00', 'M9FgO0VTqaukMZw-0keX9A', '1dda3b40-bba0-4686-a40e-e55d3cae1c74'),
	('00000000-0000-0000-0000-000000000000', 108, 'tNJnyC_AYyNN2doYEFK95A', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', false, '2025-01-03 19:41:31.456258+00', '2025-01-03 19:41:31.456258+00', 'BQ8gheMQ43mTYqrkq3GguA', '1dda3b40-bba0-4686-a40e-e55d3cae1c74');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "first_name", "last_name", "trail_name", "image", "role", "measuring_system", "onboard_date", "address_1", "address_2", "city", "state", "country", "created_at", "updated_at", "location", "slug") VALUES
	('00000000-0000-0000-0000-000000000000', 'admin@gearcloset.com', NULL, NULL, NULL, NULL, 'USER', 'IMPERIAL', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-08 20:39:55.426509+00', '2024-12-08 20:39:55.426509+00', NULL, '373ba5a8-7995-4274-8223-7e07061bc747'),
	('0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', 'jimmiejackson414@gmail.com', 'Jimmie', 'Jackson', 'Walk ''n Eat', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf/Image from iOS (3).jpg', 'USER', 'IMPERIAL', '2024-12-08 21:00:14.422+00', NULL, NULL, NULL, NULL, NULL, '2024-12-08 20:39:55.426509+00', '2024-12-08 21:00:14.463554+00', NULL, '56fb2b8b-f8c4-4f6d-beaf-f0b0d07fc842');


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."trips" ("id", "created_at", "name", "description", "starting_point", "ending_point", "starting_date", "ending_date", "slug", "updated_at", "profile_id") VALUES
	(1, '2024-12-08 20:39:55.426509+00', 'My first trip!', 'This is my first trip to plan.', 'Starting point', 'Ending point', NULL, NULL, '17d0b471-268a-4c75-ab35-abd9c4de3c64', '2024-12-08 20:39:55.426509+00', '00000000-0000-0000-0000-000000000000'),
	(2, '2024-12-08 20:39:55.426509+00', 'My first trip!', 'This is my first trip to plan.', 'Starting point', 'Ending point', NULL, NULL, 'c3dd98a2-0817-40f3-b075-ee19e14b7174', '2024-12-08 20:39:55.426509+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf');


--
-- Data for Name: polls; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: answers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: packs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."packs" ("id", "name", "slug", "created_at", "updated_at", "profile_id", "theme", "private", "allow_comments") VALUES
	(1, 'Summer', '8b3ce6bd-0b81-49d1-a785-50e2e7befe8a', '2024-12-09 06:42:08.411065+00', '2024-12-14 21:33:34.139372+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', 'GENESIS6', true, true);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "created_at", "name", "unit", "slug", "pack_id", "updated_at", "position") VALUES
	(1, '2024-12-09 20:10:41.534857+00', 'The Big 3: Pack/Shelter/Sleep', 'lb', 'a9c4176b-dbec-436d-a194-7b7f10fff5bb', 1, '2024-12-30 23:27:36.300077+00', 2),
	(4, '2024-12-09 20:10:41.534857+00', 'Clothing Worn', 'lb', '63b76fd8-694b-409a-b192-b5fb50593785', 1, '2024-12-13 00:11:27.820634+00', 5),
	(8, '2024-12-09 20:10:41.534857+00', 'Other', 'lb', '435957aa-c50b-46d9-86cf-faab8d9262bc', 1, '2024-12-13 00:12:55.147415+00', 9),
	(7, '2024-12-09 20:10:41.534857+00', 'Water and Food', 'lb', 'f507e338-4e0c-4238-9f96-c444ac3e524e', 1, '2024-12-13 00:12:55.147415+00', 8),
	(6, '2024-12-09 20:10:41.534857+00', 'Toiletries/ First Aid/ Emergency', 'lb', '7a44068b-a2ea-4c3d-b922-1d6715317f99', 1, '2024-12-13 00:12:55.147415+00', 7),
	(5, '2024-12-09 20:10:41.534857+00', 'Clothing Carried', 'lb', '46ac36d9-3308-466e-9129-d4c749982515', 1, '2024-12-13 00:12:55.147415+00', 6),
	(3, '2024-12-09 20:10:41.534857+00', 'Water', 'lb', 'a489ac3e-c243-4b2e-a461-8a4a4e5c8c75', 1, '2024-12-13 00:12:55.147415+00', 4),
	(2, '2024-12-09 20:10:41.534857+00', 'Kitchen', 'lb', '5e3e49d4-a569-4f86-bcba-3dbbd63d51a3', 1, '2024-12-13 00:12:55.147415+00', 3);


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."items" ("id", "name", "generic_type", "price", "consumable", "worn", "quantity", "unit", "weight", "url", "slug", "created_at", "updated_at", "profile_id") VALUES
	(45, 'Chair', 'Helinox Chair Zero', 0, NULL, NULL, 1, 'oz', '16', NULL, 'abd641c7-4871-4603-a308-5f8ced6410ab', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(31, 'Beanie', 'SmartWool Beanie', 0, NULL, NULL, 1, 'oz', '0.32', NULL, '4e1f0700-b328-4c6d-81c2-f2ecdd1a95f4', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(30, 'Outer Shell', 'MontBell Versatile - Japanese', 0, NULL, NULL, 1, 'oz', '5.9', NULL, 'a52b3488-7245-4a72-9fca-f75708d05862', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(29, 'Down jacket', 'MontBell EX Light Anorak', 0, NULL, NULL, 1, 'oz', '6.2', NULL, 'ec2463a6-b7ec-4557-819a-c9e3914cc06a', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(28, 'Sleep shirt', 'Lightweight synthetic shirt', 0, NULL, NULL, 1, 'oz', '4', NULL, '5015d9fa-1379-4424-afcb-ed086c24e143', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(27, 'Sleep shorts', 'Running shorts', 0, NULL, NULL, 1, 'oz', '4', NULL, 'bfbc3509-3f92-457b-b9da-97cf138b3180', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(26, 'Long Underwear', 'REI Brand', 0, NULL, NULL, 1, 'oz', '6', NULL, '6c74b04a-10bf-4232-93a9-68e02c1f0c88', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(25, 'Underwear', 'ExOfficio Give ''n Go', 0, NULL, NULL, 1, 'oz', '3', NULL, '1e0adb7f-322a-4121-a85a-831aff2b97e9', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(24, 'Socks', 'Darn Tough', 0, NULL, NULL, 1, 'lb', '0.29', NULL, '3e7caf94-d05e-4dcc-8e5c-a57e6c253c37', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(23, 'Camp Shoes', 'VivoBarefoot Ultra 3 Mens', 0, NULL, NULL, 1, 'oz', '6.7', NULL, 'ab0a49f8-4b78-4f60-b4b8-40d472e9dca3', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(22, 'Pants', 'Prana Zion Stretch Pants Straight', 0, NULL, true, 1, 'oz', '13.6', NULL, '19449c5f-1ffd-4a72-bb42-e9f9f65bbe59', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(21, 'Hat', 'Mountain Hardware Wide Brim Hat', 0, NULL, true, 1, 'oz', '3.2', NULL, '292842ec-baff-465a-85a4-3392a76e811c', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(20, 'T-Shirt', 'Patagonia Capilene Cool Trail', 0, NULL, true, 1, 'oz', '5.3', NULL, '0ea80475-3370-490a-a281-b7d6c03a2db1', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(19, 'Underwear', 'ExOfficio Give ''n Go', 0, NULL, true, 1, 'oz', '3', NULL, 'afe39a4f-600f-43ab-af31-b8ffba13f119', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(18, 'Sock Liner', 'Injinji Liner Crew Socks', 0, NULL, true, 1, 'oz', '0.2', NULL, '014efb99-1ac8-4ed0-8ace-714aa9d3bf93', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(17, 'Socks', 'Darn Tough', 0, NULL, true, 1, 'lb', '0.29', NULL, '58dc42fb-13fa-4dfd-ac4a-fdd37cfc3810', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(16, 'Shoes', 'Altra Lone Peak 3.5', 0, NULL, true, 1, 'oz', '19', NULL, '1d7accf3-293b-4083-b3e6-8ba7ae04c0ea', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(15, 'Water bottle', 'Smart Water', 0, NULL, NULL, 2, 'oz', '1.4', NULL, 'cb24b885-ff2b-412a-8a70-0b25e027e31d', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(14, 'Sawyer Squeeze', NULL, 0, NULL, NULL, 1, 'oz', '3', NULL, 'a3fe3eaa-0dcd-45bb-970e-7df21c730990', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(44, 'Knife', 'Pocket knife', 0, NULL, NULL, 1, 'oz', '2', NULL, 'a3bf9878-2b02-4a1f-bf58-e6e69e804853', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(43, 'Sunglasses', NULL, 0, NULL, NULL, 1, 'oz', '3', NULL, '2d9dd1e5-4f0f-4daa-8271-4a3efba078fd', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(42, 'Plastic bags', NULL, 0, NULL, NULL, 1, 'oz', '0.3', NULL, 'c0fb7417-0af5-4eb5-91f9-e2540ef40ba1', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(41, 'Camp Towel', 'LiteSmith Lightload Towels', 0, NULL, NULL, 1, 'oz', '0.3', NULL, '7f6f587a-fe14-40e3-8ac7-dfb39505c78d', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(40, 'Headlamp', 'Black Diamond Spot Headlamp', 0, NULL, NULL, 1, 'oz', '3', NULL, 'e4032cbb-6f09-4bdc-8460-2a3cb055e3a2', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(39, 'Trekking Poles', 'Black Diamond Alpine Cork Trekking Poles', 0, NULL, true, 1, 'oz', '18', NULL, '42ef8e2a-f875-4de6-b9af-36735ff0bdd5', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(38, 'Water/liter', NULL, 0, true, NULL, 0, 'lb', '2.2', NULL, 'e0b98247-859d-43be-aaad-23718ddc5133', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(37, 'Food/day', NULL, 0, true, NULL, 0, 'lb', '1.6', NULL, 'f31128be-0852-447e-a064-752e955618ab', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(36, 'Sunscreen', NULL, 0, NULL, NULL, 1, 'oz', '2', NULL, '83220c11-5594-4728-a4a2-f79ada6cc62b', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(35, 'First Aid', 'Needle, ibuprofen, bandaids, etc', 0, NULL, NULL, 1, 'oz', '2', NULL, 'ab7da057-324b-497f-95b6-00c14918ab6f', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(34, 'Toilet paper', NULL, 0, true, NULL, 1, 'oz', '3', NULL, '19459d2f-6e78-4af0-9d0f-e111d073e9f6', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(33, 'Toothbrush/Toothpaste', 'Zpacks ultralight', 0, NULL, NULL, 1, 'oz', '0.13', NULL, '93deaa21-e4ab-444b-9a1c-ffc3c1735c49', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(32, 'Neck gaiter', 'Buff', 0, NULL, true, 1, 'lb', '0', NULL, '441c9b77-1727-49af-943b-245bfb3432e7', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(13, 'Bear Canister', 'BV500', 0, NULL, NULL, 1, 'oz', '41', 'https://www.amazon.com/Bear-Vault-BV500-Resistant-Canister/dp/B0019LSGQE/ref=sr_1_1?ie=UTF8&qid=1498942245&sr=8-1&keywords=bear%2Bcanister%2Bbv500&th=1&psc=1', 'f67f3574-5ab4-4e78-9acc-068e44a70c28', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(12, 'Lighter', 'Mini-bic', 0, NULL, NULL, 1, 'oz', '0.4', NULL, '2fb04584-01ee-4b42-9d14-40cde103daf4', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(11, 'Titanium spork', 'Light My Fire Titanium Spork', 0, NULL, NULL, 1, 'oz', '0.3', NULL, 'cbc6c22e-11d7-4dbb-aa3b-488dd547091a', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(10, 'Titanium pot', 'Toaks 700mL pot', 0, NULL, NULL, 1, 'oz', '3.2', NULL, 'b30cf34f-09f6-4703-9e97-11599c0a1a2f', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(9, 'Fuel canister', NULL, 0, true, NULL, 1, 'oz', '6.5', NULL, 'f4d136bc-ff5f-483e-9ad4-ef51097b645b', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(8, 'Stove', 'MSR Pocket Rocket 2', 0, NULL, false, 1, 'oz', '3.7', NULL, 'e889e3d2-fa1e-4a40-811e-1e14a284014e', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(7, 'Sleeping Pad', 'NEMO Tensor Insulated', 0, NULL, NULL, 1, 'oz', '19', NULL, '8364ceb6-5f3a-4b8a-ad14-32832cd7ade2', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(6, 'Tent', 'Zpacks Duplex', 0, NULL, NULL, 1, 'oz', '19', NULL, '0176218c-055d-4660-bd1f-99e18962cb08', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(5, 'Pillow', 'Sea to Summit Aeros UL Large', 0, NULL, NULL, 1, 'oz', '18.7', NULL, 'e163f2e1-2dec-4e70-8a41-9299b3da756f', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(4, 'Compression Sack', 'Granite Gear Air Compressor 8L', 0, NULL, false, 1, 'oz', '1.76', NULL, '7212f027-fc3c-4b7d-8527-265c36d559cb', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(3, 'Sleeping Bag', 'REI Magma 15 Long', 0, NULL, false, 1, 'oz', '30.6', NULL, 'f38014f1-2027-4e14-9e6b-0805e5ecc36f', '2024-12-09 20:10:41.534857+00', '2024-12-11 00:50:30.689335+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(2, 'Tent Stakes', 'Zpacks Carbon Fiber', 0, false, false, 6, 'oz', '0.22', NULL, '47f893a8-c703-48ff-b002-748683d5d496', '2024-12-09 20:10:41.534857+00', '2024-12-31 17:14:24.501819+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf'),
	(1, 'Backpack', 'Zpacks Arc Haul', 200, false, false, 1, 'oz', '24.4', 'https://www.zpacks.com/products/arc-haul-ultra-60l-backpack?srsltid=AfmBOoryDloSMY_-iLZun3fDPIvskNTUzXhjMyDbDzjVBZk7O3sB_n0N', '97fba1ed-50b2-4b70-9d6d-01bf0af8becb', '2024-12-09 20:10:41.534857+00', '2025-01-03 19:54:46.066599+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf');


--
-- Data for Name: category_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."category_items" ("id", "category_id", "item_id", "position", "created_at", "updated_at") VALUES
	(3, 1, 3, 3, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(4, 1, 4, 4, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(5, 1, 5, 5, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(6, 1, 6, 6, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(7, 1, 7, 7, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(14, 3, 14, 1, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(15, 3, 15, 2, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(16, 4, 16, 1, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(17, 4, 17, 2, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(18, 4, 18, 3, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(19, 4, 19, 4, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(20, 4, 20, 5, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(21, 4, 21, 6, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(22, 4, 22, 7, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(23, 5, 23, 1, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(24, 5, 24, 2, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(25, 5, 25, 3, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(26, 5, 26, 4, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(27, 5, 27, 5, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(28, 5, 28, 6, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(29, 5, 29, 7, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(30, 5, 30, 8, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(31, 5, 31, 9, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(32, 5, 32, 10, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(33, 6, 33, 1, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(34, 6, 34, 2, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(35, 6, 35, 3, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(36, 6, 36, 4, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(37, 7, 37, 1, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(38, 7, 38, 2, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(39, 8, 39, 1, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(40, 8, 40, 2, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(41, 8, 41, 3, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(42, 8, 42, 4, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(43, 8, 43, 5, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(44, 8, 44, 6, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(45, 8, 45, 7, '2024-12-09 20:10:41.534857+00', '2024-12-09 20:10:41.534857+00'),
	(8, 2, 8, 1, '2024-12-09 20:10:41.534857+00', '2024-12-22 20:38:22.579509+00'),
	(9, 2, 9, 2, '2024-12-09 20:10:41.534857+00', '2024-12-22 20:38:22.579509+00'),
	(10, 2, 10, 3, '2024-12-09 20:10:41.534857+00', '2024-12-22 20:38:22.579509+00'),
	(11, 2, 11, 4, '2024-12-09 20:10:41.534857+00', '2024-12-22 20:38:22.579509+00'),
	(12, 2, 12, 5, '2024-12-09 20:10:41.534857+00', '2024-12-22 20:38:22.579509+00'),
	(13, 2, 13, 6, '2024-12-09 20:10:41.534857+00', '2024-12-22 20:38:22.579509+00'),
	(1, 1, 1, 1, '2024-12-09 20:10:41.534857+00', '2024-12-31 19:37:49.729843+00'),
	(2, 1, 2, 2, '2024-12-09 20:10:41.534857+00', '2024-12-31 19:37:49.729843+00');


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "stripe_customer_id", "profile_id", "deleted_at") VALUES
	('b5560c4b-209c-463d-a9a9-346cdc96e005', 'cus_RMalN6iu0bEbQQ', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', NULL);


--
-- Data for Name: friend_invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."notifications" ("id", "title", "content", "read_on_date", "created_at", "updated_at", "profile_id", "sender_id") VALUES
	(1, 'Welcome!', 'Welcome to Gear Closet! This is where you will receive all of your important updates.', NULL, '2024-12-08 20:39:55.426509+00', '2024-12-08 20:39:55.426509+00', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000'),
	(2, 'Welcome!', 'Welcome to Gear Closet! This is where you will receive all of your important updates.', NULL, '2024-12-08 20:39:55.426509+00', '2024-12-08 20:39:55.426509+00', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '00000000-0000-0000-0000-000000000000');


--
-- Data for Name: onboarding_steps; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "active", "name", "description", "image", "metadata", "environment") VALUES
	('prod_MBUoVUuqPMhSzr', true, 'LIFE', 'Life Subscription', NULL, NULL, 'development'),
	('prod_MBUp4I7PECSUt8', true, 'FREE', 'Free Subscription', NULL, NULL, 'development'),
	('prod_MBUqTPNMOEXkud', true, 'ANNUAL', 'Anual Subscription', NULL, NULL, 'development'),
	('prod_MBUqb4q7Fmbr5w', true, 'MONTHLY', 'Monthly Subscription', NULL, NULL, 'development');


--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."prices" ("id", "product_id", "active", "description", "unit_amount", "currency", "type", "interval", "interval_count", "trial_period_days", "metadata", "identifier", "environment") VALUES
	('price_1LT7p4ETbN7lq0iRI7h3f6yt', 'prod_MBUoVUuqPMhSzr', true, 'Life price', 0, NULL, 'recurring', 'year', NULL, NULL, NULL, 'LIFE', 'development'),
	('price_1LT7q3ETbN7lq0iRkA2h6Pz9', 'prod_MBUp4I7PECSUt8', true, 'Free price', 0, NULL, 'recurring', 'year', NULL, NULL, NULL, 'FREE', 'development'),
	('price_1LT7r2ETbN7lq0iRRyXeOjcw', 'prod_MBUqTPNMOEXkud', true, 'Annual price', 1999, NULL, 'recurring', 'year', NULL, NULL, NULL, 'ANNUAL', 'development'),
	('price_1LT7qZETbN7lq0iR8XATvvWr', 'prod_MBUqb4q7Fmbr5w', true, 'Monthly price', 199, NULL, 'recurring', 'month', NULL, NULL, NULL, 'MONTHLY', 'development');


--
-- Data for Name: profile_answers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: replies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shopping_list_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subscriptions" ("id", "profile_id", "status", "metadata", "price_id", "quantity", "cancel_at_period_end", "created_at", "current_period_start", "current_period_end", "ended_at", "cancel_at", "canceled_at", "trial_start", "trial_end", "stripe_subscription_id") VALUES
	('69c1f80a-bb3c-4c04-b3f5-6e1190db3fdb', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', 'active', '{"profile_id": "0e803be6-3911-40f7-bdf4-9a4a2bff2ddf"}', 'price_1LT7p4ETbN7lq0iRI7h3f6yt', 1, false, '2024-12-08 21:00:15.829515+00', '2024-12-08 21:00:15+00', '2025-12-08 21:00:15+00', NULL, '2024-12-08 21:00:15.829515+00', '2024-12-08 21:00:15.829515+00', '2024-12-08 21:00:15.829515+00', '2024-12-08 21:00:15.829515+00', 'sub_1QTraNETbN7lq0iRh4vU4BjW');


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: trip_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: trip_friends; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: trip_packs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2024-12-08 20:46:47.868923+00', '2024-12-08 20:46:47.868923+00', true, false, 8388608, '{image/*}', NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('c1e19b57-c40f-4917-9019-f1512172012f', 'avatars', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf/Image from iOS (3).jpg', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '2024-12-08 20:47:01.850483+00', '2024-12-08 20:47:01.850483+00', '2024-12-08 20:47:01.850483+00', '{"eTag": "\"185d3d6cb4041629b5e3326948818d1a\"", "size": 45969, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-12-08T20:47:01.845Z", "contentLength": 45969, "httpStatusCode": 200}', '58882a1a-b131-44b4-8c97-c0b7548f7332', '0e803be6-3911-40f7-bdf4-9a4a2bff2ddf', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 108, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."answers_id_seq"', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 20, true);


--
-- Name: category_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."category_items_id_seq"', 58, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."comments_id_seq"', 1, false);


--
-- Name: friend_invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."friend_invitations_id_seq"', 1, false);


--
-- Name: friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."friends_id_seq"', 1, false);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."items_id_seq"', 58, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."notifications_id_seq"', 2, true);


--
-- Name: packs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."packs_id_seq"', 1, true);


--
-- Name: polls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."polls_id_seq"', 1, false);


--
-- Name: profile_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."profile_answers_id_seq"', 1, false);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."questions_id_seq"', 1, false);


--
-- Name: replies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."replies_id_seq"', 1, false);


--
-- Name: shopping_list_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."shopping_list_items_id_seq"', 1, false);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."todos_id_seq"', 1, false);


--
-- Name: trip_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."trip_details_id_seq"', 1, false);


--
-- Name: trip_friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."trip_friends_id_seq"', 1, false);


--
-- Name: trip_packs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."trip_packs_id_seq"', 1, false);


--
-- Name: trips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."trips_id_seq"', 2, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
