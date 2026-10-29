---
name: bmad-help
description: Orienta o estado atual do fluxo BMAD Lite e recomenda a próxima skill adequada.
---

# BMad Help — Serviço da Palavra

## Objetivo
Entender onde o trabalho está, responder dúvidas sobre o fluxo e recomendar o próximo passo sem despejar um catálogo inteiro.

## Fontes obrigatórias
1. Leia `README.md` e a documentação disponível em `servico-palavra/docs/` e `servico-palavra/apps/web/README.md`.
2. Se existir, leia `servico-palavra/docs/BMAD-WORKFLOW.md`.
3. Consulte `_bmad-output/implementation-artifacts/sprint-status.yaml` quando existir.
4. Inspecione a story/especificação relevante antes de sugerir avanço.

## Roteamento
- Requisito nebuloso ou story inexistente → `bmad-spec`.
- Backlog/prioridade/status → `bmad-sprint-planning`.
- Story aprovada e pronta → `bmad-build`.
- Implementação concluída e verificada → `bmad-code-review` em contexto novo.

## Regras
- Responda em português.
- Não altere código/status quando o pedido for apenas orientação.
- Não faça commit, push, merge ou criação de branch.
- Preserve decisões já aprovadas pelo usuário.
- Para trabalho cross-repo, identifique explicitamente a dependência no backend.