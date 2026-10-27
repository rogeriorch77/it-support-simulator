-- IT SUPPORT SIMULATOR / v1.1 - FASE 1A: RASCUNHO PARA REVISAO
-- NAO EXECUTAR NO BANCO DE PRODUCAO SEM APROVACAO E TESTE EM HOMOLOGACAO.
-- Inventario lido em 2026-10-27; PostgreSQL 17; projeto Supabase IT Support Simulator.
-- Preserva XP atual e permissao UPDATE ampla; a restricao de XP sera feita
-- na fase 2, junto com a logica de pontuacao validada no servidor.
--
-- PRE-REQUISITOS:
-- (1) Snapshot/backup confirmado do banco (nao e apenas backup dos arquivos).
-- (2) Smoke test existente de OAuth Google/GitHub, ranking e upsert de perfil.
-- (3) Validar grants/trigger/policies atuais contra o diagnostico registrado.
-- (4) Revisar o efeito de restringir SELECT anon para consumidores externos.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Remover permissoes de administracao desnecessarias dos roles web.
-- RLS nao protege operacoes TRUNCATE.
REVOKE TRUNCATE, TRIGGER, REFERENCES
ON TABLE public.profiles FROM anon, authenticated;

-- O site publico consulta campos do ranking e a identidade visual v1.1.
-- profile_setup_completed e id nao devem ser publicos na API anon.
-- SELECT * em profiles via anon deixa de funcionar de proposito.
REVOKE SELECT ON TABLE public.profiles FROM anon;
GRANT SELECT (github_username, github_avatar, display_name, avatar_kind, avatar_id, custom_avatar_path, total_xp, quizzes_played, best_score)
ON TABLE public.profiles TO anon;

-- Corrigir as policies de insert/update, com role especifica e
-- auth.uid() em subconsulta para evitar reevaluacao por linha.
ALTER POLICY profiles_own_insert ON public.profiles
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);
ALTER POLICY profiles_own_update ON public.profiles
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- O frontend atual faz upsert do proprio perfil, mas authenticated
-- nao possui INSERT no estado atual. Permitir apenas colunas de perfil.
-- A RLS exige id = auth.uid() para cada insercao.
GRANT INSERT (id, github_username, github_avatar, updated_at)
ON TABLE public.profiles TO authenticated;

-- A trigger de auth.users chama handle_new_user(), com SQL qualificado.
-- Fixar search_path e negar chamada RPC direta para roles web.
ALTER FUNCTION public.handle_new_user() SET search_path = '';
REVOKE EXECUTE ON FUNCTION public.handle_new_user()
FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable()
FROM PUBLIC, anon, authenticated;

-- Nao recriar/remover gatilhos on_auth_user_created nem ensure_rls.
-- Nao tocar em XP, service_role, estruturas de auth ou registros.
COMMIT;
