\set ON_ERROR_STOP on
\echo === CASE 1: permissions, RLS and trigger metadata ===
DO $assert$
DECLARE n int;
BEGIN
  IF (SELECT count(*) FROM public.profiles) <> 2 THEN
     RAISE EXCEPTION 'Fixture user count changed';
  END IF;
  IF (SELECT sum(total_xp) FROM public.profiles) <> 470 THEN
     RAISE EXCEPTION 'Existing XP totals changed';
  END IF;
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.profiles'::regclass) THEN
     RAISE EXCEPTION 'RLS is disabled';
  END IF;
  IF has_table_privilege('anon','public.profiles','TRUNCATE')
    OR has_table_privilege('authenticated','public.profiles','TRUNCATE')
    OR has_table_privilege('anon','public.profiles','TRIGGER')
    OR has_table_privilege('authenticated','public.profiles','TRIGGER') THEN
     RAISE EXCEPTION 'Dangerous table grants remain';
  END IF;
  IF has_table_privilege('anon','public.profiles','SELECT') THEN
     RAISE EXCEPTION 'Anon still has unrestricted table SELECT';
  END IF;
  IF has_column_privilege('anon','public.profiles','id','SELECT')
    OR has_column_privilege('anon','public.profiles','total_correct','SELECT') THEN
     RAISE EXCEPTION 'Anon can read internal profile columns';
  END IF;
  IF NOT has_column_privilege('anon','public.profiles','github_username','SELECT')
    OR NOT has_column_privilege('anon','public.profiles','github_avatar','SELECT')
    OR NOT has_column_privilege('anon','public.profiles','total_xp','SELECT')
    OR NOT has_column_privilege('anon','public.profiles','quizzes_played','SELECT')
    OR NOT has_column_privilege('anon','public.profiles','best_score','SELECT') THEN
     RAISE EXCEPTION 'Leaderboard public fields unavailable';
  END IF;
  IF NOT has_column_privilege('authenticated','public.profiles','github_username','INSERT')
    OR NOT has_column_privilege('authenticated','public.profiles','github_avatar','INSERT')
    OR has_column_privilege('authenticated','public.profiles','total_xp','INSERT') THEN
     RAISE EXCEPTION 'Profile INSERT grants incorrect';
  END IF;
  IF has_function_privilege('anon','public.handle_new_user()','EXECUTE')
    OR has_function_privilege('authenticated','public.handle_new_user()','EXECUTE')
    OR has_function_privilege('anon','public.rls_auto_enable()','EXECUTE')
    OR has_function_privilege('authenticated','public.rls_auto_enable()','EXECUTE') THEN
     RAISE EXCEPTION 'Public can execute privileged functions';
  END IF;
  IF NOT EXISTS (
     SELECT 1 FROM pg_proc WHERE oid='public.handle_new_user()'::regprocedure
       AND EXISTS (SELECT 1 FROM unnest(proconfig) AS setting WHERE setting LIKE 'search_path=%')) THEN
     RAISE EXCEPTION 'Trigger function search_path is not fixed';
  END IF;
  IF NOT EXISTS (
     SELECT 1 FROM pg_policies WHERE policyname='profiles_own_update'
       AND roles='{authenticated}' AND with_check IS NOT NULL) THEN
     RAISE EXCEPTION 'Owner update policy missing WITH CHECK';
  END IF;
  IF NOT EXISTS (
     SELECT 1 FROM pg_trigger WHERE tgrelid='auth.users'::regclass
       AND tgname='on_auth_user_created' AND tgenabled='O') THEN
     RAISE EXCEPTION 'Auth profile trigger unavailable';
  END IF;
  IF NOT EXISTS (
     SELECT 1 FROM pg_event_trigger WHERE evtname='ensure_rls' AND evtenabled='O') THEN
     RAISE EXCEPTION 'RLS safety event trigger unavailable';
  END IF;
END
$assert$;
\echo PASS: privilege, RLS and trigger invariants

\echo === CASE 2: anon public read, forbidden columns and truncate ===
BEGIN;
SET LOCAL ROLE anon;
SELECT github_username,github_avatar,total_xp,quizzes_played,best_score
 FROM public.profiles ORDER BY total_xp DESC;
DO $anon$
BEGIN
  BEGIN
    PERFORM id FROM public.profiles LIMIT 1;
    RAISE EXCEPTION 'Anon unexpectedly selected private id';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    PERFORM * FROM public.profiles LIMIT 1;
    RAISE EXCEPTION 'Anon unexpectedly executed SELECT *';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    EXECUTE 'TRUNCATE TABLE public.profiles';
    RAISE EXCEPTION 'Anon unexpectedly truncated profiles';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END
$anon$;
ROLLBACK;
\echo PASS: anonymous leaderboard-only access

\echo === CASE 3: authenticated own-profile upsert and foreign-row isolation ===
BEGIN;
SET LOCAL request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
SET LOCAL ROLE authenticated;
DO $auth$
DECLARE affected int;
DECLARE own_xp int;
BEGIN
  INSERT INTO public.profiles (id, github_username, github_avatar, updated_at)
  VALUES ('11111111-1111-4111-8111-111111111111',
          'Updated Student','https://avatars.githubusercontent.com/u/123', now())
  ON CONFLICT (id) DO UPDATE
    SET github_username=excluded.github_username,
        github_avatar=excluded.github_avatar, updated_at=excluded.updated_at;
  IF NOT EXISTS (SELECT 1 FROM public.profiles
    WHERE id='11111111-1111-4111-8111-111111111111'
    AND github_username='Updated Student') THEN
    RAISE EXCEPTION 'Own profile upsert failed';
  END IF;
  UPDATE public.profiles SET total_xp=9999
    WHERE id='22222222-2222-4222-8222-222222222222';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN
    RAISE EXCEPTION 'RLS permitted editing someone elses XP';
  END IF;
  BEGIN
    INSERT INTO public.profiles(id,total_xp)
      VALUES ('11111111-1111-4111-8111-111111111111',9999);
    RAISE EXCEPTION 'Unauthorized XP insertion succeeded';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END
$auth$;
ROLLBACK;
\echo PASS: own upsert works, cross-user writes blocked

\echo === CASE 4: user creation trigger still runs ===
BEGIN;
INSERT INTO auth.users(id,raw_user_meta_data)
 VALUES ('33333333-3333-4333-8333-333333333333','{"user_name":"Fictional User"}');
DO $created$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.profiles
   WHERE id='33333333-3333-4333-8333-333333333333'
   AND github_username='Fictional User') THEN
   RAISE EXCEPTION 'on_auth_user_created did not create profile';
 END IF;
END $created$;
ROLLBACK;
\echo PASS: auth.users insert triggers new profile

\echo === CASE 5: new tables are RLS protected ===
BEGIN;
CREATE TABLE public.v11_ddl_fixture (id int primary key);
DO $ddl$
BEGIN
 IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.v11_ddl_fixture'::regclass) THEN
   RAISE EXCEPTION 'ensure_rls did not enable RLS';
 END IF;
END $ddl$;
ROLLBACK;
\echo PASS: DDL trigger enables RLS

\echo === ALL REAL SQL VALIDATION CASES PASSED ===
