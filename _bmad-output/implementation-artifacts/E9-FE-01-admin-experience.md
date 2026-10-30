# Story E9-FE-01 — Admin Experience

Status: done  
Prioridade: P1

## Objetivo
Levar o painel administrativo ao mesmo padrão de qualidade visual, responsividade, acessibilidade e feedback já aplicado à área do usuário, sem alterar regras de negócio do backend.

## Implementação
- nova camada `admin-experience.css`, escopada em `.admin-area`, reutilizando os tokens E4;
- dark mode, foco, campos, listas, filtros, ações e densidade mobile alinhados ao restante do produto;
- `AdminConteudosContent` usa `Loading`, `EmptyState`, `StatusNotice` e `Button loading`;
- `AdminCategoriasContent` usa os mesmos padrões de feedback/loading;
- ações de publicação, criação, ativação e exclusão mantêm estado disabled/ocupado durante requests;
- autorização por role Admin preservada e corrigido um loop real do `AuthGate` para usuário autenticado sem a role necessária;
- nenhuma dependência nova ou serviço pago foi introduzido.

## Cobertura
`tests/e2e/admin.spec.ts` cobre:
- `/admin/conteudos`;
- `/admin/categorias`;
- `/admin/conteudos/novo`;
- `/admin/conteudos/[id]/editar`;
- 320, 390, 768, 1024 e 1440 px;
- loading e feedback acessível em ações assíncronas;
- bloqueio de usuário sem role Admin;
- redirect da raiz `/admin`.

A suíte responsiva total do gate executou 50 cenários sem overflow horizontal, dos quais 20 são específicos do admin.

## Evidência
GitHub Actions `Frontend Verify` run `40984056070`: `success`.

No mesmo run ficaram verdes:
- audit de produção;
- type-check;
- lint;
- build Next.js;
- autenticação;
- recuperação de senha;
- responsividade;
- interação do plano adaptativo;
- acessibilidade drawer/dialog;
- E2E admin.

## Review
APPROVED.

A revisão adversarial encontrou e corrigiu um defeito funcional no `AuthGate`: uma atualização forçada de `/me` para usuário sem role podia reiniciar o effect antes de chegar ao estado `unauthorized`. O gate agora nega acesso de forma determinística sem request extra.

## Definition of Done
Atendida. A área administrativa está consistente com a fundação visual e comportamental do produto e protegida pelo mesmo quality gate do restante do frontend.
