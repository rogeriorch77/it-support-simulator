# IT Support Simulator v1.1 — Homologação SQL local (27/10/2026)

## Ambientes

- **Produção (somente leitura):** Supabase `IT Support Simulator N1/N2`, PostgreSQL 17, 661 perfis existentes, 346 com XP. Nenhuma alteração aplicada.
- **Homologação técnica local:** PostgreSQL 18.6 instalado em WSL Ubuntu, base fictícia `itsim_v11_homolog`, sem conexão ao Supabase e sem dados pessoais.
- **Branch de trabalho:** `release/v1.1-stabilization` na worktree isolada `.git/stage-v11` dentro do projeto local.
- **Por que local:** a organização Supabase é Free e não havia branches de desenvolvimento; criação de ambiente remoto pode gerar custo.

## Artefatos

- `docs/SUPABASE-HARDENING-REVIEW.sql` — SQL proposto, aplicado **somente na homologação local**.
- `docs/SUPABASE-HARDENING-ROLLBACK-REVIEW.sql` — script emergencial, testado **somente no banco local**.
- `docs/SUPABASE-HARDENING-VERIFY.sql` — consultas diagnósticas.
- `tests/db-homologation-baseline.sql` — imitação explícita do esquema, ACL, RLS, gatilhos e funções existentes, com duas contas fictícias.
- `tests/db-homologation-smoke.sql` — testes SQL reais, incluindo uma terceira identidade de teste em transação com rollback.
- `tests/db-homologation-rollback-check.sql` — asserts da reversão de grants, policies e funções.
- `tests/run-homologation-roundtrip.sh` — rollback → verificar restauração → reaplicar → executar smoke test.
- `tests/database-hardening.test.cjs` — testes estáticos das alterações SQL.

## Resultados observados

1. Fixture fictícia criada com sucesso.
2. `SUPABASE-HARDENING-REVIEW.sql` aplicado integralmente no banco local (COMMIT confirmado).
3. Teste de privilégios, RLS, trigger auth.users e DDL trigger: **PASS**.
4. Leitura anônima de cinco campos do ranking, bloqueio de `id`, `SELECT *` e `TRUNCATE`: **PASS**.
5. Upsert pelo dono do perfil, prevenção de alteração do XP de outro usuário e de INSERT direto de XP: **PASS**.
6. Criação de terceiro usuário fictício disparando criação automática de perfil: **PASS** (teste revertido por ROLLBACK).
7. Criação de tabela com evento de habilitação de RLS: **PASS** (teste revertido por ROLLBACK).
8. Rollback em ambiente local: **PASS**; permissões originais e contagem/XP restaurados.
9. Reaplicação da migração e repetição dos smoke tests: **PASS**.

## Limites e portões de produção

- A versão local usa PostgreSQL **18.6** enquanto o projeto real usa **17.6**; é necessária conferência final nessa versão.
- A base reproduz os componentes PostgreSQL observados, **não** integra Supabase Auth/GoTrue, PostgREST, Google ou GitHub OAuth. Login real, API REST e configuração de dashboard ainda não foram testados.
- Os dados existentes da produção não foram duplicados, copiados nem alterados.
- Os SQL são **rascunhos** e ainda não foram convertidos em migrações versionadas do Supabase.
- XP permanece atualizável pelo usuário para não quebrar clientes antigos; resolver na **Fase 2**, com atribuição de pontos no servidor.
- Bloqueios antes de produção: backup restaurável, revisão do pacote, homologação equivalente ao Supabase hospedado (ou janela controlada com teste e rollback), confirmação de compatibilidade de integração, aprovação explícita para DDL em produção, deploy frontend coordenado.
- Recomendação de precedência: aplicar grants/RLS e revisar smoke tests de Auth/Ranking **antes** de liberar v1.1, nunca diretamente sem janela e plano reversível.

## Comando reexecutável

Dentro do Windows (Desktop Commander):
```powershell
wsl -d Ubuntu -u root -- pg_ctlcluster 18 main start
wsl -d Ubuntu -u root -- bash /mnt/c/Dev/it-support-simulator/.git/stage-v11/tests/run-homologation-roundtrip.sh
```

Para a primeira criação da base local (somente se não existir): criar `itsim_v11_homolog` como usuário postgres, aplicar `tests/db-homologation-baseline.sql`, aplicar `docs/SUPABASE-HARDENING-REVIEW.sql`. Não repetir a fixture em banco existente.

**Produção: inalterada. GitHub: sem commit, push ou deploy.**
