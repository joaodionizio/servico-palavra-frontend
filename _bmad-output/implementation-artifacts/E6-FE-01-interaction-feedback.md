# Story E6-FE-01 — Microinterações, feedback e reconciliação do plano

Status: in-progress  
Prioridade: P1  
Dependências: E3 backend, E4 design system e E5 responsividade — concluídas

## Objetivo
Melhorar a sensação de resposta do produto sem animações decorativas excessivas: ações importantes devem ter estado de processamento consistente, confirmação clara e reconciliação com os dados reais do backend.

## Diagnóstico
- o design system já possui hover/press, focus e reduced-motion;
- botões de ação usam textos de loading diferentes e sem indicador visual padronizado;
- mensagens de sucesso/erro estão espalhadas em estilos ad hoc;
- ao concluir/desmarcar uma leitura, o frontend faz atualização otimista apenas do status local;
- o backend adaptativo pode redistribuir `DataPrevista` dos dias pendentes, então o cronograma exibido pode ficar desatualizado até recarregar a página.

## Estratégia
1. Adicionar loading visual reutilizável ao componente `Button`, sem dependência nova.
2. Criar componente `StatusNotice` para feedback success/error/info com `aria-live`/`role` apropriados.
3. Manter toggle de leitura otimista para resposta imediata.
4. Após sucesso da mutação, reconciliar plano/cronograma com a API para refletir redistribuição real de datas.
5. Em falha, restaurar estado anterior e apresentar feedback acessível.
6. Aplicar o padrão primeiro a plano bíblico e cronograma, que são fluxos críticos do produto.
7. Proteger a reconciliação com Playwright, incluindo mudança de datas retornada pelo backend após conclusão.

## Critérios de aceitação
1. Botões em processamento possuem spinner consistente, `aria-busy` e ficam indisponíveis durante a ação.
2. Reduced-motion continua respeitado.
3. Concluir leitura altera o status imediatamente e depois usa o cronograma retornado pela API.
4. Datas redistribuídas pelo backend aparecem sem reload manual.
5. Desmarcar leitura também reconcilia as datas.
6. Falha da mutação restaura o estado anterior e mostra erro acessível.
7. Feedback de sucesso é anunciado sem bloquear interação.
8. Nenhuma dependência nova é adicionada.
9. Audit, type-check, lint, build, regressões, responsividade e acessibilidade permanecem verdes.

## Fora de escopo
- animações de celebração complexas;
- confete, sons ou feedback intrusivo;
- sistema global de notificações com biblioteca externa;
- redesign adicional das páginas.

## Definition of Done
Interações críticas respondem imediatamente, reconciliam com o backend e são protegidas por E2E; review final APPROVED.
