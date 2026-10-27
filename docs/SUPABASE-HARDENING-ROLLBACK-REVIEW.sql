-- IT SUPPORT SIMULATOR / FASE 1A - ROLLBACK PREPARADO, NAO EXECUTAR.
-- DESTINADO SOMENTE A RECUPERACAO EM EMERGENCIA APOS MIGRACAO REVISTA.
-- Retorna permissões inseguras do estado anterior; nao e a configuracao desejada.
-- Confirmar o snapshot anterior; o rollback nao recupera dados perdidos.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Restaurar o estado de privileges observado em 2026-10-27.
GRANT TRUNCATE, TRIGGER, REFERENCES
ON TABLE public.profiles TO anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;
REVOKE SELECT (github_username, github_avatar, total_xp, quizzes_played, best_score)
ON TABLE public.profiles FROM anon;
REVOKE INSERT (id, github_username, github_avatar, updated_at)
ON TABLE public.profiles FROM authenticated;

-- profiles_own_insert: antes tinha role PUBLIC e auth.uid() = id.
ALTER POLICY profiles_own_insert ON public.profiles
  TO PUBLIC WITH CHECK (auth.uid() = id);

-- Para restaurar precisamente o WITH CHECK nulo original do UPDATE,
-- recriar somente esta policy dentro da mesma transacao.
DROP POLICY profiles_own_update ON public.profiles;
CREATE POLICY profiles_own_update ON public.profiles
  FOR UPDATE TO PUBLIC USING (auth.uid() = id);

ALTER FUNCTION public.handle_new_user() RESET search_path;
-- handle_new_user tinha ACL DEFAULT (proacl null): EXECUTE via PUBLIC.
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO PUBLIC;
-- rls_auto_enable tinha grants PUBLIC + anon + authenticated + service_role.
GRANT EXECUTE ON FUNCTION public.rls_auto_enable()
TO PUBLIC, anon, authenticated;

COMMIT;
