# Story E4-FE-01 — Design system v2 e interação visual consistente

Status: done  
Prioridade: P1

## Objetivo
Consolidar a identidade visual já existente do Serviço da Palavra em uma fundação reutilizável, responsiva e acessível, sem redesenhar a marca e sem adicionar biblioteca/serviço pago.

## Implementação
- criada a camada `design-system.css`, separada do CSS legado;
- adicionados tokens semânticos para brand, accent, page/surface, texto, borda, foco, sucesso/erro, radius, sombra e motion;
- `Button` e `LinkButton` passaram a compartilhar `.ui-control`, com alvo mínimo de 44px, estados hover/active, foco visível e variantes semânticas;
- `Card` passou a compartilhar `.ui-card`, com radius/sombra/token e padding responsivo;
- hover de elevação é aplicado apenas em dispositivos com `hover: hover` + `pointer: fine`;
- `prefers-reduced-motion: reduce` neutraliza movimentos/transforms e encurta animações decorativas próprias;
- foco `:focus-visible` foi centralizado e navegação lateral/mobile ganhou tratamento coerente;
- dark mode foi reforçado nos componentes tocados: dashboard, cards, formações, filtros, plano e cronograma;
- estados de loading/erro/vazio foram migrados para os componentes-base onde aplicável;
- nenhuma nova dependência npm, biblioteca visual ou serviço externo foi adicionada.

## Critérios de aceitação — resultado
1. Tokens semânticos — atendido em `design-system.css`.
2. `Button`/`LinkButton` com 44px, foco, active e reduced motion — atendido.
3. `Card` com padding responsivo — atendido (`p-5 sm:p-7 lg:p-8`).
4. Navegação com foco visível coerente — atendido.
5. Motion decorativo respeita `prefers-reduced-motion` — atendido e protegido por E2E existente.
6. Dark mode preservado/reforçado — atendido nos componentes e telas tocados.
7. Sem dependência/custo novo — atendido.
8. Audit, type-check, lint, build e E2E verdes — atendido.

## Componentes/telas alinhados
- `Button` / `LinkButton`;
- `Card`;
- `AppShell`;
- dashboard e cards de jornada;
- cards e filtros de formações;
- resumo/progresso/leitura diária do plano bíblico;
- tabela resumida e cronograma completo/mensal;
- estados de loading/erro/vazio relacionados.

## Review adversarial
Resultado: **APPROVED**.

Pontos revisados:
- hover não depende de mouse em dispositivos touch;
- reduced motion neutraliza transforms próprios;
- foco de teclado não é removido pelos novos estilos;
- dark mode não ficou preso a superfícies claras nos componentes migrados;
- tokens/componentes-base reduziram repetição sem impor migração total do CSS em uma única story;
- identidade azul/amarelo e composição existente foram preservadas;
- nenhuma infraestrutura paga ou dependência visual nova foi introduzida.

## Dívida preservada conscientemente
Os warnings atuais de ESLint relacionados a padrões antigos de effects/refs e `<img>` já faziam parte do baseline do E0. Eles permanecem visíveis como warnings e serão tratados na story E8, sem misturar refatoração arquitetural ampla nesta entrega.

## Evidência de CI
Frontend Verify `40976470112` concluído com `success` sobre o commit final `c7a38f0be1fea150c965b8343b00550516593207`.

Passaram: install, audit de produção, type-check, lint, build, autenticação, recuperação de senha, reset, segurança/reduced-motion e responsividade autenticada.

## Fora de escopo
- redesign completo da marca;
- trocar Tailwind;
- migrar todos os hex codes em uma única story;
- refatoração estrutural de todas as páginas;
- resolver toda dívida de lint/arquitetura do baseline.

## Definition of Done
Fundação implementada, identidade preservada, CI verde e review independente aprovado.
