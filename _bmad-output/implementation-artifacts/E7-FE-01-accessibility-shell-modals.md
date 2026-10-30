# Story E7-FE-01 — Foco, teclado e ARIA em navegação e modais

Status: done  
Prioridade: P1  
Dependências: E4-FE-01 e E5-FE-01 — concluídas

## Objetivo
Fechar as principais lacunas de acessibilidade de interação no shell autenticado e no modal do cronograma, garantindo navegação previsível por teclado sem alterar a identidade visual.

## Implementação
- criado hook reutilizável `useFocusTrap`, sem dependência externa;
- o hook captura o elemento previamente focado, move foco para o container, contém `Tab`/`Shift+Tab`, trata Escape por callback e restaura foco no fechamento;
- drawer mobile usa focus trap apenas abaixo de 1024px;
- drawer fechado fica `inert` e `aria-hidden=true` no mobile, evitando foco em conteúdo fora da tela;
- conteúdo principal fica `inert` + `aria-hidden=true` enquanto o drawer mobile está aberto e é restaurado no fechamento;
- Escape fecha o drawer e devolve foco ao botão que abriu;
- modal mensal do cronograma usa o mesmo focus trap;
- diálogo mantém `role="dialog"`, `aria-modal="true"`, `aria-labelledby` e ganhou `aria-describedby`;
- Escape fecha o diálogo e devolve foco ao card mensal que o abriu;
- fechamento por mouse no botão/overlay continua funcionando;
- cards mensais sinalizam `aria-haspopup="dialog"`.

## Critérios de aceitação — resultado
1. Foco entra no drawer ao abrir por teclado — atendido.
2. `Tab`/`Shift+Tab` ficam contidos no drawer — atendido por E2E.
3. Escape fecha drawer e restaura foco — atendido por E2E.
4. Conteúdo principal fica inerte durante drawer — atendido por E2E.
5. Foco entra no diálogo mensal — atendido.
6. `Tab`/`Shift+Tab` ficam contidos no diálogo — atendido por E2E.
7. Escape fecha diálogo e restaura foco ao card — atendido por E2E.
8. Semântica ARIA do diálogo preservada — atendido.
9. Mouse/touch continuam abrindo/fechando drawer e modal — atendido; fluxos responsivos anteriores permaneceram verdes.
10. Nenhuma dependência npm nova — atendido.
11. Audit, type-check, lint, build e todos os E2E permanecem verdes — atendido.

## Testes
Foi criada `tests/e2e/accessibility.spec.ts`, com dois cenários de teclado:
- drawer mobile: foco inicial, `inert`, ciclo real do primeiro/último elemento focável visível, Escape e restauração;
- diálogo mensal: foco inicial no botão Fechar, ciclo de teclado, Escape, restauração e fechamento por clique.

O CI passou a executar os dois gates separadamente:
- `E2E — acessibilidade / drawer`;
- `E2E — acessibilidade / diálogo`.

## Falso negativo corrigido durante a story
O primeiro teste do drawer assumia que o ciclo deveria voltar especificamente ao link “Início”. O focus trap, corretamente, inclui todos os controles focáveis do drawer (incluindo controles anteriores à navegação). O teste foi corrigido para identificar dinamicamente o primeiro/último elemento focável visível e validar o ciclo real, sem reduzir a cobertura.

## Review adversarial
Resultado: **APPROVED**.

Pontos revisados:
- foco não escapa para o conteúdo principal no drawer;
- drawer fora da tela não permanece alcançável por teclado;
- foco anterior é restaurado somente se o elemento ainda estiver conectado;
- callback de Escape é estável para evitar reinstalação desnecessária do trap;
- modal reutiliza a mesma infraestrutura em vez de duplicar lógica;
- nenhuma biblioteca de acessibilidade adicional foi necessária;
- responsividade, recuperação de senha e autenticação permaneceram verdes após a mudança.

## Evidência de CI
Frontend Verify `40977809611` concluído com `success` no commit `2351059fb11fafcbf51668d26d376e4e91f7f378`.

Passaram: install, audit de produção, type-check, lint, build, autenticação, recuperação de senha, todos os resets, segurança/reduced-motion, responsividade, acessibilidade do drawer e acessibilidade do diálogo.

## Fora de escopo
- auditoria WCAG completa de todas as páginas;
- leitor de tela automatizado externo;
- redesign visual;
- refatoração ampla dos effects existentes (E8).

## Definition of Done
Critérios atendidos, testes de teclado verdes, CI final verde e review independente aprovado.
