# Story E8-FE-01 — Arquitetura e dívida técnica do frontend

Status: in-progress  
Prioridade: P2  
Dependências: E0, E4, E5 e E7 — concluídas

## Objetivo
Reduzir dívida arquitetural e warnings reais do frontend sem esconder regras de lint, sem alterar contratos e sem adicionar custo operacional.

## Baseline
- CI verde com type-check, lint, build e E2E.
- Lint com 19 warnings no baseline medido antes da story.
- Principais grupos: `react-hooks/set-state-in-effect`, `react-hooks/exhaustive-deps`, `react-hooks/refs` e `@next/next/no-img-element`.
- CSS legado ainda concentra responsabilidades demais, mas a fundação do design system já foi modularizada na E4.

## Estratégia
1. Eliminar warnings mecânicos de estado derivado/efeitos evitáveis.
2. Corrigir dependências de hooks e loaders sem loops ou round-trips extras.
3. Simplificar estado inicial de tema/sidebar e sincronizações do shell.
4. Revisar `useAuth` sem quebrar deduplicação de `/me` nem fluxos de expiração.
5. Manter `<img>` quando a troca por otimização do provedor puder criar custo/complexidade; documentar esse residual em vez de silenciar a regra globalmente.
6. Separar refatorações grandes de CSS/componentes apenas quando houver ganho comprovável e cobertura existente.

## Critérios de aceitação
1. Nenhuma regra de lint relevante é desabilitada para esconder dívida.
2. O número de warnings cai de forma mensurável em relação ao baseline de 19.
3. Login continua sem GET `/me` redundante após sucesso.
4. Logout e expiração de sessão continuam corretos.
5. Dashboard, formações, cronograma e plano bíblico preservam comportamento e responsividade.
6. Drawer/modal preservam acessibilidade de foco da E7.
7. Nenhuma dependência npm nova é necessária para a refatoração.
8. Audit, type-check, lint, build e todos os E2E permanecem verdes.

## Fora de escopo
- reescrever todo o frontend;
- trocar framework/biblioteca de estado;
- adotar serviço pago de imagens/cache;
- redesign visual adicional;
- remover `<img>` apenas para zerar warning quando isso implicar custo ou restrição de host remoto.

## Definition of Done
Warnings reduzidos com justificativa para qualquer residual, regressões cobertas por CI e review final APPROVED.
