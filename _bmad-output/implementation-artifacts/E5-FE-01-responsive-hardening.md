# Story E5-FE-01 — Hardening responsivo das telas principais

Status: ready-for-dev  
Prioridade: P1  
Dependência: E4-FE-01-design-system-v2

## Objetivo
Garantir que a experiência autenticada se recomponha corretamente em 320/390/768/1024/1440px, priorizando shell, dashboard, formações e plano bíblico.

## Diagnóstico inicial
- shell já muda para drawer abaixo de 1024px, mas os estados/touch targets precisam de hardening;
- cards-base usam padding fixo elevado para mobile;
- dashboard usa `min-height`, ribbon decorativo e `journey-stats` com margem negativa orientados a desktop;
- grids respondem via breakpoints, mas ainda faltam testes de overflow nas telas autenticadas;
- tabelas/linhas do cronograma já viram blocos no mobile, porém a hierarquia e os CTAs precisam ser verificados em telas estreitas;
- E2E responsivo existente cobre login/recuperação, não a aplicação autenticada.

## Estratégia
- preservar layout desktop atual;
- ajustar densidade/spacing em mobile antes de mudar composição;
- reduzir/ocultar ornamentos quando competirem com conteúdo;
- usar breakpoints para reconfigurar hero, stats, grids e CTAs;
- adicionar E2E autenticado sem dependência de Render/Neon;
- testar ausência de overflow e visibilidade/operabilidade dos principais CTAs.

## Critérios de aceitação
1. Shell autenticado não possui overflow horizontal em 320/390/768/1024/1440.
2. Dashboard não possui overflow e mantém hero/estatísticas legíveis nos cinco tamanhos.
3. Menu mobile abre/fecha sem deslocar conteúdo lateralmente e mantém alvo mínimo de toque.
4. Cards não sacrificam conteúdo por padding excessivo em 320/390px.
5. Grid de formações recompõe 1→2→3 colunas conforme espaço disponível sem largura mínima problemática.
6. Plano bíblico e cronograma mantêm leitura/CTA/estado legíveis no mobile.
7. Ornamentos do dashboard não cobrem texto ou ação em telas estreitas.
8. E2E cobre pelo menos shell/dashboard e plano/cronograma nos cinco viewports.
9. `npm run verify` permanece verde.

## Fora de escopo
- novo branding;
- alterar contratos de API;
- redesign completo de conteúdo/admin;
- screenshots pixel-perfect como gate rígido nesta etapa.

## Definition of Done
- critérios atendidos;
- regressões responsivas protegidas por Playwright;
- CI verde;
- review independente aprovado.
