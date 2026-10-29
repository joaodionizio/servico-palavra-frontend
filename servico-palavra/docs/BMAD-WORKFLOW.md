# BMAD Lite — Serviço da Palavra

Este repositório usa um fluxo BMAD Lite inspirado no projeto Casa de Leilões, adaptado ao frontend do Serviço da Palavra.

## Skills

- `bmad-help` — orientação e próximo passo.
- `bmad-spec` — cria/atualiza story executável.
- `bmad-sprint-planning` — organiza backlog e status.
- `bmad-build` — implementa story aprovada e executa verificação.
- `bmad-code-review` — revisão adversarial independente.

A fonte canônica das skills é `.agents/skills/`. `.claude/skills/` delega para a versão canônica.

## Fluxo padrão

1. `bmad-spec`
2. aprovação da story pelo usuário
3. `bmad-build`
4. verify automatizado
5. teste manual quando aplicável
6. `bmad-code-review` em contexto novo
7. correções explícitas
8. aprovação e `done`

## Git

As skills não devem criar branch, commit, push ou merge automaticamente. O usuário mantém controle do fluxo Git. Alterações via ferramentas externas só devem ocorrer quando o usuário pedir explicitamente a modificação do repositório.

## Artefatos

Stories e status ficam em `_bmad-output/implementation-artifacts/`.

Status válidos: `backlog`, `ready-for-dev`, `in-progress`, `review`, `done`, `blocked`.

## Verificação do frontend

Gate mínimo atual:

```bash
npm run lint
npm run build
```

Hoje `lint` é apenas type-check. O E0 deve adicionar lint real, testes e E2E, consolidando tudo em `npm run verify`.

## Regras de produto/UI

- Não reescrever a interface sem necessidade; evoluir o design system existente.
- Reusar `components/ui` e tokens antes de criar estilos ad hoc.
- Motion não deve adicionar espera artificial à navegação.
- Preservar o proxy same-origin em produção, cookies first-party, CSRF e tratamento de sessão expirada.
- Mudanças relevantes devem considerar 320, 390, 768, 1024 e 1440 px.
- Considerar teclado, foco, ARIA, dark mode e `prefers-reduced-motion`.
- Loading, empty, error e success states fazem parte dos critérios de UI.

## Trabalho cross-repo

Frontend e backend permanecem separados. Use o mesmo identificador lógico de story quando uma feature exigir ambos e documente o contrato esperado em cada lado.
