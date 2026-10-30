# Story E6-FE-01 — Microinterações, feedback e reconciliação do plano

Status: done  
Prioridade: P1  
Review: APPROVED  
Dependências: E3 backend, E4 design system e E5 responsividade — concluídas

## Objetivo
Melhorar a sensação de resposta do produto sem animações decorativas excessivas: ações importantes devem ter estado de processamento consistente, confirmação clara e reconciliação com os dados reais do backend.

## Resultado
- `Button` ganhou estado de loading reutilizável com spinner, `aria-busy`, bloqueio durante processamento e label configurável;
- `StatusNotice` centraliza feedback `success`, `error` e `info` com `role`/`aria-live` apropriados;
- spinner e entrada do notice respeitam `prefers-reduced-motion`;
- plano bíblico e cronograma completo mantêm atualização otimista para resposta imediata;
- após concluir/desmarcar uma leitura com sucesso, o frontend busca novamente o plano/cronograma e aplica as datas reais devolvidas pelo backend adaptativo;
- redistribuições de `DataPrevista` passam a aparecer sem reload manual;
- se a mutação falhar, o estado otimista é revertido e um erro acessível é anunciado;
- se a mutação já tiver sido salva, mas apenas o refetch de reconciliação falhar, a alteração não é desfeita: o usuário recebe aviso de sincronização pendente;
- nenhuma dependência nova foi adicionada;
- o gate E2E novo prova loading do botão, reconciliação de data e rollback em erro.

## Critérios de aceitação
1. Botões em processamento possuem spinner consistente, `aria-busy` e ficam indisponíveis durante a ação. ✅
2. Reduced-motion continua respeitado. ✅
3. Concluir leitura altera o status imediatamente e depois usa o cronograma retornado pela API. ✅
4. Datas redistribuídas pelo backend aparecem sem reload manual. ✅
5. Desmarcar leitura também usa a mesma reconciliação. ✅
6. Falha da mutação restaura o estado anterior e mostra erro acessível. ✅
7. Feedback de sucesso é anunciado sem bloquear interação. ✅
8. Nenhuma dependência nova é adicionada. ✅
9. Audit, type-check, lint, build, regressões, responsividade e acessibilidade permanecem verdes. ✅

## Evidência de verificação
Frontend Verify — run `40982048234`, commit `04194fa2658f00b5cef72bb5eaf81d9f68b52390`:
- `npm audit --omit=dev --audit-level=high`: PASS, 0 vulnerabilidades;
- type-check: PASS;
- lint: PASS, mantendo apenas os 3 warnings de `<img>` já documentados na E8;
- build Next.js: PASS;
- E2E autenticação: PASS;
- E2E recuperação de senha: PASS em todos os cenários;
- E2E segurança/reduced-motion: PASS;
- E2E responsividade: PASS nos 30 cenários;
- E2E interação do plano adaptativo: PASS nos 2 cenários — reconciliação e rollback;
- E2E acessibilidade drawer: PASS;
- E2E acessibilidade diálogo mensal: PASS.

## Fora de escopo
- animações de celebração complexas;
- confete, sons ou feedback intrusivo;
- sistema global de notificações com biblioteca externa;
- redesign adicional das páginas.

## Definition of Done
Atendida. Interações críticas respondem imediatamente, reconciliam com o backend, preservam acessibilidade e estão protegidas por CI. Story revisada e APPROVED.
