---
name: bmad-spec
description: Cria ou atualiza uma especificação executável para uma story antes da implementação.
---

# BMad Spec — Serviço da Palavra

## Objetivo
Transformar uma demanda em uma story implementável, testável e pequena o bastante para revisão independente.

## Antes de escrever
1. Leia `README.md`, `servico-palavra/docs/ARCHITECTURE.md`, `servico-palavra/apps/web/README.md` e os arquivos reais relacionados.
2. Leia `servico-palavra/docs/BMAD-WORKFLOW.md` quando existir.
3. Consulte `_bmad-output/implementation-artifacts/sprint-status.yaml` se existir.
4. Para features cross-repo, registre mudanças e contratos esperados no backend.

## Artefato
Crie/atualize `_bmad-output/implementation-artifacts/<story-id>-<slug>.md` com:
- objetivo e contexto;
- escopo e fora de escopo;
- decisões já aprovadas;
- critérios de aceitação numerados;
- contratos API/dados quando aplicável;
- componentes/rotas/serviços afetados;
- plano de testes e verificação;
- riscos, regressões, acessibilidade e responsividade;
- Definition of Done.

## Qualidade de UI
Quando houver interface, considerar explicitamente 320/390/768/1024/1440, teclado, foco, dark mode, reduced motion, loading, empty e error states.

## Restrições
- Não implemente a story nesta skill.
- Não faça commit, push, merge ou branch.
- Não invente requisitos ausentes; marque hipóteses.
- Prefira evolução incremental a rewrite.