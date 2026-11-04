# IT Support Simulator — v1.1 / Fase 1 — Segurança (ambiente isolado)

**Base:** `release/v1.1-stabilization` no commit inicial `c10bf143`.
**Ambiente:** worktree local `.git/stage-v11`, independente da cópia `main` com modificações existentes.
**Estado:** alterações apenas locais; sem commit, push, deploy ou modificação do Supabase.

## Correções implementadas no frontend

- `js/safe-dom.js`: escape de texto/atributos HTML e validação restritiva de avatares.
- Perfis públicos: nomes e avatares codificados/validados tanto na landing quanto no ranking completo.
- Autenticação: topbar e cache de perfil protegidos contra HTML injetado; log de sessão não revela email.
- Dashboard: pesquisa e entradas de atividade tratadas como texto.
- Tickets: dados de tabela, atributos e notas do usuário escapados antes de inserção no DOM.
- Simulações: nomes e mensagens tratados como texto, cartões usam `data-scenario-id` e ouvintes em vez de montar JavaScript inline; feedback protegido.
- Terminal: dados de tickets escapados, hostname/username do contexto limitados, valores de contexto textuais sanitizados e `echo` codificado.
- Quiz: enunciado/alternativas e resultados textuais escapados nas inserções HTML.
- Google Analytics: carregamento automático retirado de `index.html` e `ranking.html` no ambiente de desenvolvimento **até existir consentimento válido**. Isso significa que a coleta de Analytics ficará pausada quando essa alteração for publicada. Fontes Google externas permanecem pendentes de revisão.

## Testes

`node --test tests/security.test.cjs` — testes de escape, URLs de avatar, ordem de scripts, autenticação, fontes de entrada e terminal simulado; incluindo verificação de bloqueio do carregamento automático do Analytics.

Esses testes **não** substituem testes reais em navegador, pentest ou revisão manual de todos os caminhos de HTML. Antes de publicar, testar Google/GitHub OAuth, landing, ranking, simulações, tickets, terminal e mobile num ambiente de homologação.

## Supabase — somente diagnóstico nesta fase

O projeto em produção continua com dados reais. Nenhum SQL de alteração foi executado.

Alertas de segurança observados no Supabase:
- `public.handle_new_user()`: função `SECURITY DEFINER` sem `search_path` fixo e com `EXECUTE` para `anon` e `authenticated`.
- `public.rls_auto_enable()`: função `SECURITY DEFINER` com `EXECUTE` público.
- `public.profiles`: políticas RLS possuem chamadas a `auth.uid()` sem `(select ...)` e privilégios excessivos (`TRUNCATE`, `TRIGGER`, `REFERENCES`).
- A tabela é legível pelo público, incluindo mais colunas do que o ranking precisa. RLS limita linhas, não restringe as colunas.
- Totais de XP continuam editáveis pelo usuário autenticado; o bloqueio definitivo depende da arquitetura de tentativas/XP da **Fase 2**.
- Alerta de proteção de senhas vazadas desabilitada; priorização depende dos provedores de login efetivamente em uso.

**Ações propostas e ainda não aplicadas:** testar em homologação a revogação de `EXECUTE` desnecessário para triggers privilegiados; fixar `search_path`; reduzir privilégios de tabela; corrigir RLS; migrar leitura pública para superfície mínima; assegurar que `upsertProfile` continua funcionando; desenhar operações server-side de XP antes de bloquear as atualizações diretas.

É importante validar os efeitos sobre a criação de contas e OAuth antes de alterar grants/triggers em produção.

## Portões pendentes para publicar

1. Validar smoke tests num navegador real, preferencialmente sem sessão de produção.
2. Revisar todos os pontos residuais de `innerHTML`; algumas inserções de HTML estático e dados internos permanecem deliberadamente.
3. Definir uma política de privacidade e consentimento adequada ao uso francês/europeu.
4. Concluir integridade de XP e permissões com testes de regressão, na Fase 2.
5. Revisar e autorizar explicitamente qualquer migração e o deploy.

**Documentação:** este arquivo registra propostas e alterações feitas na branch, não constitui autorização para modificar o banco ou publicar.


## Continuação — 27/10/2026 (Fase 1A Supabase)

- Estado remoto confirmado: 661 perfis, 346 com XP; PostgreSQL 17.
- `anon`: SELECT em todas as colunas, TRUNCATE/TRIGGER/REFERENCES; SELECT via RLS pública.
- `authenticated`: SELECT/UPDATE em todas as colunas, TRUNCATE/TRIGGER/REFERENCES; não possui INSERT apesar do upsert no frontend.
- `profiles_own_insert`/`profiles_own_update`: políticas originais aplicadas ao PUBLIC; `auth.uid() = id`; update sem `WITH CHECK` explícito.
- `handle_new_user`: trigger de `auth.users` preservado, `search_path` atualmente não fixado; EXECUTE público.
- `rls_auto_enable`: event trigger `ensure_rls` preservado; EXECUTE público desnecessário.
- A proteção de XP não foi alterada, porque depende da mudança de backend/frontend da Fase 2.

### SQL preparado, não executado

1. `SUPABASE-HARDENING-REVIEW.sql`: hardening progressivo, sem mudar dados, preserva escrita atual de XP temporariamente.
2. `SUPABASE-HARDENING-ROLLBACK-REVIEW.sql`: volta à ACL e políticas antigas, apenas recuperação emergencial (reabre riscos).
3. `SUPABASE-HARDENING-VERIFY.sql`: consultas de verificação, inclusive leitura mínima de dados públicos e saúde dos gatilhos.

A CLI Supabase não foi encontrada no computador; estes arquivos são **rascunhos SQL**, não migrações formais no histórico da plataforma. Para torná-los migrações versionadas, usar a CLI apropriada após revisão.

### Testes

`node --test tests/security.test.cjs tests/database-hardening.test.cjs`: **15 testes aprovados**, incluindo sete verificações estáticas do pacote SQL. NÃO houve execução dos scripts SQL em banco de homologação ou produção.

### Bloqueios para liberar em produção

- Revisar backup e disponibilizar banco de homologação ou branch de desenvolvimento equivalente.
- Executar scripts e testes de autenticação (Google/GitHub, criação de perfil, upsert) em homologação.
- Fazer smoke tests com e sem login: ranking, dashboard, XP existente, quiz e simulações.
- Confirmar consumidores de `profiles` que dependam de `SELECT *` anon, pois a migração limita a seleção pública.
- Solicitar autorização explícita do fundador para aplicar na base de produção após os testes.
