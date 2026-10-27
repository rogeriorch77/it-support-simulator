-- IT SUPPORT SIMULATOR — consultas somente leitura para pre/post hardening.
-- Executar ANTES, na homologacao DEPOIS e somente apos aprovar migracao em prod.
-- Validar que nenhum registro de perfil desapareceu.
SELECT COUNT(*) AS total_profiles, COUNT(*) FILTER (WHERE total_xp > 0) AS users_with_xp,
       COUNT(*) FILTER (WHERE github_username = '') AS unnamed_profiles
FROM public.profiles;

-- Uso de colunas anon: id e colunas internas devem ficar inacessiveis apos Fase 1A.
SELECT has_column_privilege('anon', 'public.profiles', 'github_username', 'SELECT') AS anon_can_read_name,
       has_column_privilege('anon', 'public.profiles', 'github_avatar', 'SELECT') AS anon_can_read_avatar,
       has_column_privilege('anon', 'public.profiles', 'total_xp', 'SELECT') AS anon_can_read_xp,
       has_column_privilege('anon', 'public.profiles', 'id', 'SELECT') AS anon_can_read_internal_id,
       has_column_privilege('anon', 'public.profiles', 'total_correct', 'SELECT') AS anon_can_read_internal_metrics,
       has_table_privilege('anon', 'public.profiles', 'TRUNCATE') AS anon_can_truncate,
       has_table_privilege('authenticated', 'public.profiles', 'TRUNCATE') AS auth_can_truncate,
       has_table_privilege('authenticated', 'public.profiles', 'TRIGGER') AS auth_can_create_trigger,
       has_column_privilege('authenticated','public.profiles','github_username','INSERT') AS auth_can_insert_name,
       has_column_privilege('authenticated','public.profiles','total_xp','INSERT') AS auth_can_insert_xp;

-- Verificar RLS, donos e policy de alteracao. Nunca desligar RLS para teste.
SELECT c.relrowsecurity, c.relforcerowsecurity FROM pg_class c
WHERE c.oid = 'public.profiles'::regclass;
SELECT policyname, roles, cmd, qual, with_check FROM pg_policies
WHERE schemaname='public' AND tablename='profiles' ORDER BY policyname;

-- Validar privileges das funcoes, search_path e existencia dos gatilhos.
SELECT p.proname,p.prosecdef,p.proconfig,
       has_function_privilege('anon',p.oid,'EXECUTE') AS anon_can_execute,
       has_function_privilege('authenticated',p.oid,'EXECUTE') AS auth_can_execute
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN ('handle_new_user','rls_auto_enable')
ORDER BY p.proname;
SELECT tgname, tgenabled, tgfoid::regprocedure::text AS calls
FROM pg_trigger WHERE tgrelid='auth.users'::regclass AND NOT tgisinternal;
SELECT evtname, evtenabled, evtfoid::regprocedure::text AS calls
FROM pg_event_trigger WHERE evtname='ensure_rls';

-- Fluxos manuais indispensaveis: login Google, GitHub, criacao de novo usuario
-- no ambiente de homologacao, atualizacao de avatar/nome, ranking anon,
-- dashboard, quiz, simulacao e reconciliacao de XP.
