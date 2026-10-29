# Story E0-FE-01 — Quality gate, lint, testes e E2E do frontend

Status: done  
Prioridade: P1

## Objetivo
Criar um gate de qualidade repetível para permitir refatorações visuais/responsivas com segurança, sem depender de serviços pagos.

## Implementação concluída
- `npm run typecheck` separado de lint.
- ESLint flat config com `eslint-config-next` e Core Web Vitals.
- Playwright com Chromium e API mockada localmente.
- `npm run verify` agregando type-check, lint, build e E2E.
- CI permanente em `.github/workflows/verify.yml` para push/PR na `main`.
- `npm audit --omit=dev --audit-level=high` no CI.
- Smoke tests em 320, 390, 768, 1024 e 1440 px.
- Testes de login, dashboard, menu mobile e sessão expirada sem depender do Render/Neon.

## Segurança de dependências
Durante o E0 o audit detectou vulnerabilidades de produção no Next.js 16.2.7 e na árvore de source maps. O baseline foi corrigido para:
- Next.js `16.4.3`;
- ESLint `10.13.0`;
- `eslint-config-next` `16.4.3`;
- Playwright `1.64.1`;
- override `source-map-js` `1.2.2`.

Após a atualização, o audit de produção passou no CI.

## Baseline de lint
O lint real revelou dívida preexistente em padrões cobertos pelas regras `react-hooks/set-state-in-effect` e `react-hooks/refs`. Essas duas regras permanecem visíveis como `warn` nesta etapa para não transformar o E0 em uma refatoração transversal de várias telas. Erros normais do ESLint continuam bloqueando o gate.

## E2E
Cobertura inicial:
1. login autenticado → dashboard;
2. menu mobile abre e expõe navegação principal;
3. sessão expirada redireciona rota protegida para login;
4. ausência de overflow horizontal na tela de login em 320 px;
5. idem em 390 px;
6. idem em 768 px;
7. idem em 1024 px;
8. idem em 1440 px.

Seletores usam papéis/nomes acessíveis quando aplicável, evitando dependência de classes visuais.

## Verificação
- Workflow temporário de finalização: run `40967431566` — **success** em lockfile, audit, type-check, lint, build, Chromium e 8 E2E.
- Workflow permanente `Frontend Verify`: run `40967807799` — **success** em `npm ci`, audit de produção e `npm run verify`.
- Workflows temporários de preparação/finalização foram removidos após validação; permanece apenas o CI permanente.

## Code review adversarial
Resultado: **APPROVED**.

Achados bloqueantes: nenhum.

Observações registradas:
- A API dos testes é mockada, portanto o CI não depende de Render, Neon ou credenciais de produção.
- O gate cobre uma base deliberadamente enxuta; cobertura detalhada deve crescer junto das próximas stories.
- As duas regras React Hooks mantidas como warning representam dívida conhecida, não um passe livre para novos erros.
- A atualização do Next foi necessária por segurança e foi validada por build + E2E antes de ser aceita.

## Critérios de aceitação
1. `npm run verify` existe e falha em type-check/lint/build/E2E quebrado — **atendido**.
2. lint real configurado — **atendido**.
3. suíte automatizada sem produção — **atendido**.
4. Playwright configurado — **atendido**.
5. viewports compactos e desktop cobertos — **atendido**.
6. CI permanente — **atendido**.
7. sem secrets de produção — **atendido**.
8. workflow BMAD documenta o gate — **atendido**.

## Definition of Done
Concluída. O projeto agora possui baseline automatizado suficiente para iniciar as stories P0 de performance e recuperação de senha com proteção contra regressões.
