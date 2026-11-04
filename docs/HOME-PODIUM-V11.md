# IT Support Simulator v1.1 — Vitrine Top 3 (27/10/2026)

## Decisão visual
A página inicial deve ser uma vitrine dos três líderes, não uma segunda página de ranking. Somente três perfis são consultados e exibidos. Os demais jogadores permanecem acessíveis através de 'Voir le classement complet' (ranking.html).

## Implementação — apenas branch isolada
- index.html: consulta `Auth.getRanking(3)`; três cartões destacados, sem a lista dos lugares 4–20.
- 1°: medalha ouro, borda e brilho dourados, rótulo LEADER.
- 2°: medalha prata e borda prateada, rótulo 2E PLACE.
- 3°: medalha bronze e borda bronze, rótulo 3E PLACE.
- Avatares maiores, pseudônimos, níveis e XP em destaque, identidade de classificação independente das cores dos níveis.
- Link para classificação completa preservado e apresentado como ação visível.
- Uma única vitrine responsiva; abaixo de 740px, os três perfis organizam-se verticalmente.
- Os nomes e URLs de avatar são tratados com SafeDom antes de inserir HTML; dado real não foi alterado.

## Validação
- `node --test tests/landing-podium.test.cjs tests/security.test.cjs tests/visual-levels.test.cjs tests/database-hardening.test.cjs`: 28 testes aprovados.
- Desktop 1365x768: renderização em Chrome headless com dados FICTÍCIOS, capturada em `.git/audit-backups/v11-exclusive-podium-desktop.png`.
- Captura estreita Chrome headless foi realizada, mas apresentou clipping de conteúdo já presente na landing; ainda exige auditoria responsiva em viewport móvel real antes do deploy.
- Página inicial em preview local: http://127.0.0.1:5176/index.html
- Nenhum commit, push, deploy ou alteração Supabase realizada.

## Pendências
- Avaliar com usuário o novo pódio em navegador desktop real e em aparelho mobile.
- Futuramente substituir avatares herdados Google/GitHub por coleção original de 12 avatares com seleção opcional de avatar neutro.
- Corrigir exibição de usuários @Anonyme ao introduzir pseudônimos públicos.
- Concluir modelo de XP validado no servidor em versão 1.1 antes da publicação.
