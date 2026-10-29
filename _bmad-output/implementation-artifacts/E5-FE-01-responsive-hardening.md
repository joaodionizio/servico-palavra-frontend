# Story E5-FE-01 — Hardening responsivo das telas principais

Status: done  
Prioridade: P1  
Dependência: E4-FE-01-design-system-v2 — concluída

## Objetivo
Garantir que a experiência autenticada se recomponha corretamente em 320/390/768/1024/1440px, priorizando shell, dashboard, formações, cronograma e plano bíblico.

## Implementação
- criada camada `responsive-hardening.css` separada do CSS legado;
- shell usa padding responsivo e `env(safe-area-inset-*)` em telas estreitas;
- dashboard ganhou densidade móvel própria para hero, ribbon, stats, grids e CTAs;
- cards-base e cards de conteúdo passaram a reduzir padding e permitir quebra de texto sem largura mínima problemática;
- formações usam grid 1→2→3 colunas e filtros com `minmax(0, 1fr)`/`min-w-0`;
- drawer mobile ganhou `aria-expanded`, `aria-controls`, fechamento por Escape, overlay e bloqueio de scroll do fundo;
- plano bíblico ganhou header/CTA responsivos, leitura diária com CTA móvel full-width e cronograma resumido sem overflow;
- cronograma completo ganhou hero responsivo, cards mensais compactos e modal adaptado ao mobile/dark mode;
- CTAs críticos ficam full-width em telas estreitas quando isso melhora operabilidade;
- ornamentos do dashboard perdem peso visual progressivamente em 767/640/390px.

## Cobertura E2E autenticada
A suíte `responsive-app.spec.ts` mocka apenas `/mock-api/**` e não depende de Render/Neon.

Nos cinco viewports (320, 390, 768, 1024 e 1440px), o CI valida:
- dashboard autenticado sem overflow horizontal;
- formações sem overflow horizontal;
- cronograma completo sem overflow horizontal;
- plano bíblico sem overflow horizontal.

Também valida no drawer mobile:
- nome acessível `Abrir menu`;
- `aria-expanded=false`;
- abertura para `Fechar menu` + `aria-expanded=true`;
- navegação principal visível;
- Escape fecha e restaura o estado acessível.

São 20 cenários autenticados de layout, além dos testes responsivos públicos já existentes para login e recuperação.

## Critérios de aceitação — resultado
1. Shell sem overflow nos cinco tamanhos — atendido.
2. Dashboard sem overflow e hero/stats responsivos — atendido.
3. Menu mobile operável, sem deslocamento lateral e com targets mínimos — atendido.
4. Cards com densidade adequada em 320/390px — atendido.
5. Grid de formações 1→2→3 sem largura mínima problemática — atendido.
6. Plano bíblico e cronograma legíveis/operáveis no mobile — atendido.
7. Ornamentos não competem com conteúdo em telas estreitas — atendido por regras responsivas.
8. E2E cobre shell/dashboard, formações, cronograma e plano nos cinco viewports — atendido.
9. Frontend Verify permanece verde — atendido.

## Falso negativo corrigido durante a story
Um run intermediário teve 22 testes responsivos verdes e 3 falhas no dashboard móvel. A causa não era overflow: o locator Playwright procurava o botão pelo nome `Abrir menu`, mas o nome acessível muda corretamente para `Fechar menu` após o clique. O teste foi corrigido para usar o controle estável via `aria-controls` e passou a validar explicitamente os dois nomes + `aria-expanded` + Escape, sem reduzir a cobertura.

## Review adversarial
Resultado: **APPROVED**.

Pontos revisados:
- ausência de overflow é medida no `documentElement` e `body`;
- fixtures usam títulos/leituras longos para pressionar o layout;
- touch/hover não dependem da mesma interação;
- drawer móvel tem estado ARIA explícito e Escape;
- cronograma separado (`/app/cronograma`) está coberto, não apenas o resumo do plano;
- nenhuma mudança de contrato de API ou infraestrutura foi necessária;
- nenhum screenshot pixel-perfect foi transformado em gate frágil.

## Evidência de CI
Frontend Verify `40976470112` concluído com `success` sobre o commit final `c7a38f0be1fea150c965b8343b00550516593207`.

Todas as etapas passaram, incluindo `E2E — responsividade`.

## Fora de escopo
- novo branding;
- alterar contratos de API;
- redesign completo de admin;
- screenshots pixel-perfect como gate rígido;
- focus trap completo/inert do drawer e modal (story E7).

## Definition of Done
Critérios atendidos, regressões responsivas protegidas por Playwright, CI verde e review independente aprovado.
