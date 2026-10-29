# Story E0-FE-01 — Quality gate, lint, testes e E2E do frontend

Status: ready-for-dev  
Prioridade: P1

## Objetivo
Criar um gate de qualidade repetível para permitir refatorações visuais/responsivas com segurança, sem depender de serviços pagos.

## Contexto
Atualmente `npm run lint` executa apenas `tsc --noEmit` e o `test` da raiz equivale a `next build`. Não existe uma suíte de testes de UI/E2E capaz de proteger os fluxos que serão alterados nas próximas stories.

## Escopo
- manter type-check explícito;
- adicionar lint real para TypeScript/React/Next;
- adicionar testes automatizados adequados para lógica/componentes críticos;
- adicionar Playwright para E2E dos fluxos principais;
- criar `npm run verify` na raiz agregando os gates;
- adicionar CI gratuito via GitHub Actions;
- definir uma matriz mínima de viewports responsivos para E2E relevante;
- evitar dependência de serviços pagos e de credenciais de produção.

## Fluxos E2E prioritários
1. login e redirecionamento para a área autenticada;
2. abrir/fechar navegação mobile;
3. dashboard renderiza estados essenciais;
4. navegação para formações, plano bíblico, cronograma e perfil;
5. comportamento de sessão expirada/401 em teste controlado;
6. smoke responsivo em 320, 390, 768, 1024 e 1440 px, quando tecnicamente viável sem duplicação excessiva.

## Fora de escopo
- corrigir a performance do login/logout;
- implementar recuperação de senha;
- redesenhar telas;
- refatorar `globals.css` nesta story;
- alterar contratos do backend.

## Critérios de aceitação
1. Existe um script `npm run verify` na raiz que executa type-check, lint real, testes e build, falhando em qualquer etapa quebrada.
2. `lint` deixa de ser apenas um alias de type-check e usa uma configuração adequada ao stack atual.
3. Existe ao menos uma suíte de testes automatizados cobrindo comportamento relevante sem depender de produção.
4. Existe configuração Playwright e smoke E2E para os fluxos prioritários possíveis em ambiente local/CI.
5. A estratégia responsiva cobre explicitamente viewports compactos e desktop; overflow horizontal inesperado deve falhar ou ser detectável nos testes relevantes.
6. Existe CI no GitHub executando `verify` e E2E aplicável em pull requests e/ou pushes relevantes.
7. Nenhum secret de produção é necessário para o gate.
8. README/workflow documenta como executar a validação localmente.

## Requisitos de acessibilidade no gate
- testes devem permitir validar controles por papel/nome acessível quando aplicável;
- evitar seletores E2E frágeis baseados apenas em classes visuais;
- manter caminho para testar teclado e reduced motion nas stories de acessibilidade.

## Verificação
- executar `npm run verify` na raiz;
- executar Playwright localmente;
- confirmar build de produção;
- confirmar que teste/lint propositalmente quebrado interrompe o gate;
- revisar CI para ausência de secrets hardcoded.

## Riscos
- tentar cobrir todas as telas no E0 e tornar a story grande demais;
- E2E depender de backend remoto instável;
- misturar correções de UI com configuração de testes.

## Estratégia
O E0 deve priorizar infraestrutura de teste e smoke tests. Cobertura detalhada cresce junto das próximas stories; não é necessário testar cada componente antes de avançar.

## Definition of Done
- critérios 1–8 atendidos;
- verify e E2E verdes;
- arquivos alterados registrados nesta story;
- story movida para `review`, não diretamente para `done`;
- `bmad-code-review` executado em contexto independente.
