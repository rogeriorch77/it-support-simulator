\set ON_ERROR_STOP on
\echo === CHECKING OLD PERMISSIONS AFTER LOCAL ROLLBACK ===
DO $check$
BEGIN
 IF (SELECT count(*) FROM public.profiles)<>2 OR
    (SELECT sum(total_xp) FROM public.profiles)<>470 THEN
   RAISE EXCEPTION 'Rollback disturbed fixture data';
 END IF;
 IF NOT has_table_privilege('anon','public.profiles','SELECT')
    OR NOT has_table_privilege('anon','public.profiles','TRUNCATE')
    OR NOT has_table_privilege('authenticated','public.profiles','TRIGGER')
    OR has_table_privilege('authenticated','public.profiles','INSERT') THEN
   RAISE EXCEPTION 'Rollback failed to restore table grants';
 END IF;
 IF NOT has_function_privilege('anon','public.handle_new_user()','EXECUTE')
    OR NOT has_function_privilege('authenticated','public.rls_auto_enable()','EXECUTE') THEN
   RAISE EXCEPTION 'Rollback did not restore public EXECUTE';
 END IF;
 IF (SELECT proconfig IS NOT NULL FROM pg_proc
     WHERE oid='public.handle_new_user()'::regprocedure) THEN
   RAISE EXCEPTION 'Rollback did not restore mutable search_path';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE policyname='profiles_own_update'
 AND roles='{public}' AND with_check IS NULL) THEN
   RAISE EXCEPTION 'Original update policy not restored';
 END IF;
END $check$;
\echo PASS: original permissions recreated on LOCAL DB, no data changed
