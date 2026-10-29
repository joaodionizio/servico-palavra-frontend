---
name: bmad-build
description: Implementa uma story aprovada do frontend do Serviço da Palavra com escopo controlado e verificação obrigatória.
---

# BMad Build — Serviço da Palavra

## Objetivo
Implementar exatamente a story aprovada, preservando identidade visual, contratos com a API e decisões já tomadas.

## Antes de editar
1. Leia a story completa em `_bmad-output/implementation-artifacts/`.
2. Leia `servico-palavra/docs/BMAD-WORKFLOW.md`, `servico-palavra/docs/ARCHITECTURE.md` e `servico-palavra/apps/web/README.md`.
3. Inspecione os componentes, services e estilos reais afetados.
4. Faça um plano de no máximo 8 linhas.
5. Registre dependências no backend no plano; não altere contratos silenciosamente.

## Implementação
- Faça a menor mudança coerente que satisfaça os critérios.
- Não faça rewrite sem necessidade demonstrada.
- Reuse `components/ui` e tokens existentes antes de criar variantes ad hoc.
- Não crie latência artificial para animações; motion deve acompanhar, não bloquear a navegação.
- Preserve cookies first-party/proxy, CSRF e tratamento global de 401.
- UI deve permanecer utilizável em 320/390/768/1024/1440 quando relevante.
- Considere teclado, foco, dark mode, reduced motion, loading, empty e error states.

## Verificação obrigatória
No estado atual, no mínimo:
`npm run lint && npm run build`
executados na raiz do repositório.
Quando E0 adicionar testes/E2E/verify, use o gate mais forte disponível e prefira `npm run verify` se existir.

## Atualização da story
Registre arquivos alterados, testes executados, resultados, limitações e fora de escopo. Mova para `review` apenas após implementação e verify concluídos.

## Restrições
- Não faça commit, push, merge ou branch.
- Não marque `done`; `done` vem após review aprovado.
- Melhorias descobertas fora do escopo viram backlog, não alterações oportunistas.