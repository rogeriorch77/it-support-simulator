# IT Support Simulator v1.1 — Harmonização visual dos níveis de XP
Data: 27/10/2026
Estado: implementado e testado na worktree isolada; sem commit, push, deploy ou atualização de usuários reais.

## Critérios aprovados
- Verde significa nível alto; roxo vem depois; laranja no meio; cinza-prateado abaixo de 2.000 XP.
- A mesma cor deve aparecer no nome/badge do nível, valor acumulado de XP e barra de progresso.
- Não pintar o cartão inteiro; manter design escuro e discreto, com texto legível.
- Nomes dos níveis em francês e medalhas de ouro/prata/bronze para posições 1/2/3, independentemente de XP.

## Faixas v1.1 (apenas classificação visual)
- 0–499: Débutant — cinza-prateado `#CBD5E1`
- 500–1.999: Junior — cinza-prateado `#CBD5E1`
- 2.000–4.999: Confirmé — laranja `#FDBA74`
- 5.000–9.999: Senior — roxo `#B197FC`
- 10.000–49.999: Expert — verde `#4ADE80`
- 50.000+: Élite — verde `#4ADE80`

A barra mede progresso até o próximo patamar nomeado, não posição global. No nível Élite é preenchida a 100%.

## Implementação
- `js/xp-levels.js`: definição compartilhada, única fonte de verdade visual.
- `index.html` e `ranking.html`: removidas tabelas de níveis duplicadas; cor aplicada ao badge, XP e barra; medalhas mantidas. Medalhas 🥇/🥈/🥉 usam os mesmos símbolos legíveis da página inicial.
- `js/auth.js`: `getLevel` usa classificação compartilhada; nenhuma mudança em login, sincronização ou dados.
- `js/progress.js`: nível/nome/cor agora compartilham a tabela, sem alterar `XP_TABLE` ou fórmula de ganho.
- `dashboard.html`: nível, XP, estrelas e barras/anel recebem a mesma cor.
- `quiz.html`: nível, XP acumulado e barras seguem a mesma paleta.
- Todos os HTML que carregam auth/progress recebem `js/xp-levels.js` antes deles.

## Verificação
- `node --test tests/security.test.cjs tests/database-hardening.test.cjs tests/visual-levels.test.cjs` passou com 23/23 testes, incluindo contrastes de texto WCAG AA e medalhas.
- `node --check` de todos os arquivos JavaScript concluído.
- `git diff --check` concluído.
- Renderização testada no Chrome headless com identidades e XP fictícios, preservando o layout do ranking real.
- Testes validam limites, nomes, cores e carregamento dos scripts em todas as páginas.

## Limites da mudança
- O histórico local do quiz e o histórico local de simulações continuam separados; **essa mudança unifica apenas os níveis e cores**, não os totais de XP. A reconciliação das pontuações pertence à Fase 2 de integridade do progresso.
- Nenhum dado do Supabase ou do ranking real foi modificado.
- A versão pública segue inalterada até deploy aprovado e testes em homologação.
