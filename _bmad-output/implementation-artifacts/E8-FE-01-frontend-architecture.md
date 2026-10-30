# Story E8-FE-01 — Arquitetura e dívida técnica do frontend

Status: done  
Prioridade: P2  
Review: APPROVED  
Dependências: E0, E4, E5 e E7 — concluídas

## Objetivo
Reduzir dívida arquitetural e warnings reais do frontend sem esconder regras de lint, sem alterar contratos e sem adicionar custo operacional.

## Resultado
- baseline de lint reduzido de **19 warnings para 3 warnings**;
- todos os warnings de `react-hooks/set-state-in-effect`, `react-hooks/exhaustive-deps` e `react-hooks/refs` foram eliminados por refatoração real;
- os 3 warnings residuais são exclusivamente `@next/next/no-img-element` em imagens externas de conteúdo;
- nenhuma regra de lint foi desabilitada ou rebaixada para ocultar dívida;
- nenhuma dependência npm nova foi adicionada;
- login continua usando a resposta do POST sem GET `/me` redundante;
- deduplicação de `/me` preservada por cache de requisição em voo fora do estado React;
- `AppShell` deixou de sincronizar tema e rail por setters em effect: tema usa a classe `dark` já inicializada antes da hidratação e rail usa `useSyncExternalStore` com `localStorage`;
- fechamento do drawer ao navegar passou a ocorrer diretamente nos links, removendo sincronização por pathname;
- loaders iniciais de dashboard, formações, detalhe de formação, cronograma, plano bíblico e admin foram simplificados para evitar renders em cascata;
- derivação de progresso/agenda do plano bíblico virou função pura, facilitando rollback e manutenção;
- formulário de perfil deixou de duplicar estado do usuário via effect;
- estados de erro de imagem dos cards passaram a ser associados à URL, removendo effects de reset.

## Residual deliberado — imagens externas
Os três `<img>` restantes continuam intencionalmente sem migração automática para o pipeline de otimização do provedor. O projeto permite thumbnails externas (YouTube/Google) e a prioridade atual é manter custo operacional zero e comportamento previsível. A regra permanece ativa e os avisos ficam documentados para uma story específica de estratégia de imagens, caso exista uma solução comprovadamente sem custo adicional e compatível com todos os hosts permitidos pela CSP.

## Evidência de verificação
Frontend Verify — run `40980286709`, commit `079f49f8bc89b9efd1e622b3257879a06d70001f`:
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades;
- type-check: PASS;
- lint: PASS com 3 warnings residuais documentados e 0 erros;
- build Next.js: PASS;
- E2E autenticação: PASS;
- E2E recuperação de senha: PASS em todos os cenários;
- E2E segurança/reduced-motion: PASS;
- E2E responsividade: 30/30 PASS;
- E2E acessibilidade drawer: PASS;
- E2E acessibilidade diálogo mensal: PASS.

## Critérios de aceitação
1. Nenhuma regra de lint relevante é desabilitada para esconder dívida. ✅
2. O número de warnings cai de forma mensurável em relação ao baseline de 19. ✅ 19 → 3.
3. Login continua sem GET `/me` redundante após sucesso. ✅
4. Logout e expiração de sessão continuam corretos. ✅
5. Dashboard, formações, cronograma e plano bíblico preservam comportamento e responsividade. ✅
6. Drawer/modal preservam acessibilidade de foco da E7. ✅
7. Nenhuma dependência npm nova é necessária para a refatoração. ✅
8. Audit, type-check, lint, build e todos os E2E permanecem verdes. ✅

## Fora de escopo
- reescrever todo o frontend;
- trocar framework/biblioteca de estado;
- adotar serviço pago de imagens/cache;
- redesign visual adicional;
- remover `<img>` apenas para zerar warning quando isso implicar custo ou restrição de host remoto.

## Definition of Done
Atendida. Story revisada e APPROVED com CI completo verde.
