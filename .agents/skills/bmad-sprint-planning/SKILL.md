---
name: bmad-sprint-planning
description: Planeja e mantém o status da sprint do frontend do Serviço da Palavra sem implementar código.
---

# BMad Sprint Planning — Serviço da Palavra

## Objetivo
Organizar backlog, prioridades e prontidão das stories mantendo um estado simples e auditável.

## Fonte de status
Use `_bmad-output/implementation-artifacts/sprint-status.yaml` quando existir. Se não existir e o usuário pedir planejamento, crie-o.

## Status permitidos
- `backlog`
- `ready-for-dev`
- `in-progress`
- `review`
- `done`
- `blocked`

## Procedimento
1. Leia `servico-palavra/docs/BMAD-WORKFLOW.md`, README e arquitetura relevante.
2. Leia as stories existentes em `_bmad-output/implementation-artifacts/`.
3. Priorize correção funcional/performance antes de acabamento visual.
4. Marque `ready-for-dev` somente quando critérios e dependências estiverem claros.
5. Registre dependências no backend explicitamente.

## Prioridade
- P0: autenticação, regressões funcionais, performance perceptível, dados e segurança.
- P1: testes, responsividade, acessibilidade, design system e arquitetura.
- P2: refactors não bloqueantes e manutenção.

## Restrições
- Não implemente código.
- Não faça commit, push, merge ou branch.
- Não marque `done` sem verify + review.