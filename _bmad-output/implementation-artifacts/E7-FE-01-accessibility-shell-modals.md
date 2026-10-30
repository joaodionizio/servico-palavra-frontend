# Story E7-FE-01 — Foco, teclado e ARIA em navegação e modais

Status: in-progress  
Prioridade: P1  
Dependências: E4-FE-01 e E5-FE-01 — concluídas

## Objetivo
Fechar as principais lacunas de acessibilidade de interação no shell autenticado e no modal do cronograma, garantindo navegação previsível por teclado sem alterar a identidade visual.

## Diagnóstico
- drawer mobile já possui `aria-expanded`, `aria-controls`, Escape e bloqueio de scroll, mas o foco ainda pode escapar para o conteúdo atrás;
- ao fechar o drawer, a restauração explícita do foco ao botão que abriu não está protegida por teste;
- modal mensal do cronograma possui `role=dialog`/`aria-modal`, porém não mantém foco dentro do diálogo, não fecha por Escape e não restaura foco ao card do mês;
- não existe utilitário reutilizável de focus trap.

## Estratégia
1. Criar hook reutilizável `useFocusTrap` sem nova dependência.
2. Capturar o elemento focado antes da abertura.
3. Mover o foco para um elemento interativo dentro do container.
4. Circular `Tab`/`Shift+Tab` entre os elementos focáveis do container.
5. Suportar Escape por callback configurável.
6. Restaurar o foco ao elemento de origem no fechamento.
7. Marcar o conteúdo principal como `inert` durante o drawer mobile aberto, evitando interação assistiva com o fundo.
8. Proteger drawer e modal com Playwright.

## Critérios de aceitação
1. Ao abrir o drawer mobile por teclado, o foco entra no drawer.
2. `Tab` e `Shift+Tab` não escapam do drawer enquanto aberto.
3. Escape fecha o drawer e devolve foco ao botão de abertura.
4. O conteúdo principal fica inerte enquanto o drawer está aberto e volta ao normal ao fechar.
5. Ao abrir um mês do cronograma, o foco entra no diálogo.
6. `Tab` e `Shift+Tab` ficam contidos no diálogo.
7. Escape fecha o diálogo e restaura foco ao card mensal que o abriu.
8. `role="dialog"`, `aria-modal` e `aria-labelledby` permanecem corretos.
9. Mouse/touch continuam funcionando para abrir/fechar drawer e modal.
10. Nenhuma dependência npm nova é adicionada.
11. Type-check, lint, build e E2E permanecem verdes.

## Fora de escopo
- auditoria WCAG completa de todas as páginas;
- leitor de tela automatizado externo;
- redesign visual;
- refatoração ampla dos effects existentes (E8).

## Definition of Done
Critérios atendidos, testes de teclado verdes e review independente aprovado.
