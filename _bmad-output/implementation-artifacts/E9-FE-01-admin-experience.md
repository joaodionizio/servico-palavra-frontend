# Story E9-FE-01 — Admin Experience

Status: ready-for-dev  
Prioridade: P1

## Objetivo
Levar o painel administrativo ao mesmo padrão de qualidade visual, responsividade, acessibilidade e feedback já aplicado à área do usuário, sem alterar regras de negócio do backend.

## Escopo
- revisar `/admin`, `/admin/conteudos`, `/admin/conteudos/novo`, `/admin/conteudos/[id]/editar` e `/admin/categorias`;
- reutilizar design tokens, Button, Card, StatusNotice e padrões de loading existentes;
- garantir dark mode consistente;
- garantir teclado/foco/ARIA em formulários, filtros, ações destrutivas e modais quando existirem;
- validar 320/390/768/1024/1440 sem overflow horizontal inesperado;
- melhorar hierarquia visual de filtros, tabelas/cards, paginação e estados empty/loading/error;
- manter autorização/roles atuais e não ampliar superfície administrativa;
- adicionar E2E autenticado com role admin para smoke dos fluxos principais.

## Critérios de aceitação
1. Todas as rotas admin principais usam a fundação visual E4/E6 em vez de estilos isolados quando houver componente reutilizável.
2. Não existe overflow horizontal inesperado em 320/390/768/1024/1440 nas rotas cobertas.
3. Dark mode mantém contraste e legibilidade.
4. Ações assíncronas têm loading/disabled/feedback acessível consistente.
5. Navegação por teclado e foco visível funcionam nos controles administrativos.
6. Formulários possuem labels/mensagens de validação compreensíveis e não dependem apenas de cor.
7. E2E cobre ao menos listagem de conteúdos, filtros/paginação quando aplicável, abertura de criação/edição e categorias.
8. Usuário sem role admin continua impedido de acessar a área administrativa.
9. Audit, type-check, lint, build e toda a suíte E2E existente permanecem verdes.
10. Nenhuma dependência paga ou serviço novo é introduzido.

## Fora de escopo
- novas funcionalidades administrativas de negócio;
- alteração de contratos do backend;
- troca do modelo de autorização;
- redesign da área pública já concluída.

## Definition of Done
Área administrativa consistente com o restante do produto, protegida por E2E e review final APPROVED.
