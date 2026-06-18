# Security Inventory

Data: 2026-06-11

## Escopo Verificado

Este repositório, no estado atual, contém o frontend V2 em `servico-palavra/apps/web` e um app legado em `app-plano-biblico`.

O backend ASP.NET Core foi removido deste repositório a pedido do proprietário. Portanto, controllers, services, use cases, repositories, entidades EF Core, migrations, middlewares ASP.NET Core, autenticação server-side, autorização server-side, CORS server-side, rate limiting server-side e testes de integração ASP.NET Core não puderam ser verificados aqui.

## Arquitetura Atual

### Frontend V2

- `servico-palavra/apps/web`
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Deploy planejado: Vercel Free
- API externa configurada por `NEXT_PUBLIC_API_URL`

### App legado ainda presente

- `app-plano-biblico`
- Next.js
- Supabase client-side
- Contém `.env.local` local ignorado pelo Git, mas presente no workspace
- Risco: pode confundir deploy, auditoria e manutenção se permanecer no mesmo repositório

## Projetos .NET

Nenhum projeto .NET encontrado no estado atual:

- `.sln`: não encontrado
- `.csproj`: não encontrado
- controllers ASP.NET Core: não encontrados
- services ASP.NET Core: não encontrados
- middlewares ASP.NET Core: não encontrados
- migrations EF Core: não encontradas

## Rotas Frontend V2

### Públicas

- `/` redireciona para `/login`
- `/login`
- `/cadastro`

### Privadas

- `/app`
- `/app/dashboard`
- `/app/formacoes`
- `/app/formacoes/[slug]`
- `/app/biblioteca`
- `/app/favoritos`
- `/app/plano-biblico`
- `/app/plano-biblico/configurar`
- `/app/cronograma`
- `/app/perfil`

### Administrativas

- `/admin`
- `/admin/dashboard`
- `/admin/conteudos`
- `/admin/conteudos/novo`
- `/admin/conteudos/[id]/editar`
- `/admin/categorias`
- `/admin/usuarios`
- `/admin/rankings`

Observação: proteção de rota no frontend é apenas UX. Segurança real deve existir no backend.

## Componentes Frontend Relevantes

- `src/components/auth/AuthGate.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/conteudos/*`
- `src/components/plano-biblico/*`
- `src/components/admin/*`
- `src/lib/api.ts`
- `src/lib/auth.ts`
- `src/hooks/useAuth.ts`
- `src/data/mocks.ts`

## Endpoints Esperados pelo Frontend

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Conteúdos e progresso

- `GET /api/dashboard/me`
- `GET /api/categorias`
- `GET /api/conteudos`
- `GET /api/conteudos/{id}`
- `GET /api/favoritos`
- `POST /api/conteudos/{id}/favoritar`
- `DELETE /api/conteudos/{id}/favoritar`
- `POST /api/conteudos/{id}/concluir`

### Plano bíblico

- `GET /api/planos-biblicos/ativo`
- `POST /api/planos-biblicos`
- `POST /api/planos-biblicos/alterar`
- `GET /api/planos-biblicos/{id}/dias`
- `POST /api/planos-biblicos/dias/{diaId}/concluir`

### Admin

- `POST /api/admin/categorias`
- `PUT /api/admin/categorias/{id}`
- `POST /api/admin/conteudos`
- `PUT /api/admin/conteudos/{id}`
- `PATCH /api/admin/conteudos/{id}/publicar`
- `PATCH /api/admin/conteudos/{id}/despublicar`

## IDs Recebidos pela Interface

No frontend V2 há rotas com:

- `slug` de formação
- `id` de conteúdo admin

Esses identificadores não devem autorizar acesso por si só. O backend deve validar autenticação, role e ownership para todo recurso privado.

## Dados Pessoais Tratados

- Nome
- E-mail
- Perfil/role
- Progresso de conteúdos
- Favoritos
- Plano bíblico ativo
- Histórico de planos
- Sequência de leitura
- Dados administrativos agregados

## Variáveis de Ambiente

### Frontend V2

- `NEXT_PUBLIC_API_URL`: origem pública da API. Não é segredo.

### Legado

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Arquivos locais

- `app-plano-biblico/.env.local` existe no workspace e precisa de revisão humana fora deste relatório. O valor não foi exposto neste documento.

## Dependências Frontend V2

- `next`
- `react`
- `react-dom`
- `tailwindcss`
- `typescript`
- `@tailwindcss/postcss`
- `@types/*`

## Autenticação Aplicada

### Antes da correção

O frontend V2 usava `localStorage` para token em `src/lib/auth.ts` e `src/lib/api.ts`.

### Estado corrigido

O frontend V2 não salva token no `localStorage`. O client HTTP usa `credentials: "include"` e espera cookie HttpOnly definido pelo backend. `AuthGate` valida sessão chamando `GET /api/auth/me`.

## Autorização Aplicada

No frontend:

- existe ocultação/redirecionamento de UX via `AuthGate`
- não existe autorização real

No backend:

- não verificável neste repositório
- deve ser implementado obrigatoriamente no repo do backend

## Superfície de Ataque

- Login
- Cadastro
- Sessão via cookie cross-origin
- Rotas privadas do frontend
- Rotas admin do frontend
- Consumo de links externos YouTube/Google Drive
- Exibição de dados retornados pela API
- CSP e headers no Next.js
- Dependências npm
- App legado Supabase ainda presente
- Histórico Git com referências antigas a Supabase e seed

## Arquivos/Valores Sensíveis

### Encontrados no estado atual

- `app-plano-biblico/.env.local`: arquivo local ignorado, conteúdo requer revisão humana.

### Encontrados no histórico Git

- `.env.example` antigo com nomes de variáveis Supabase, incluindo `SUPABASE_SERVICE_ROLE_KEY`, mas valores aparentam placeholders.
- `seed-plano-leitura.js` antigo referenciava service role por variável de ambiente.
- `DOCUMENTACAO_SEGURANCA.md` antigo referenciava variáveis Supabase.

Nenhum valor real foi transcrito neste documento.

## Riscos Encontrados

| ID | Severidade | Área | Risco | Status |
|----|------------|------|-------|--------|
| INV-001 | CRITICAL | Backend | Backend ausente neste repo, impossível validar ownership e authorization server-side | BLOQUEADOR |
| INV-002 | HIGH | Frontend | App legado Supabase permanece no repo | PENDENTE |
| INV-003 | HIGH | Sessão | Token em localStorage existia na V2 | CORRIGIDO |
| INV-004 | MEDIUM | Headers | Headers de segurança ausentes no Next.js | CORRIGIDO |
| INV-005 | MEDIUM | Secrets | `.env.local` legado existe localmente | DECISÃO HUMANA |
| INV-006 | MEDIUM | Histórico | Variáveis sensíveis referenciadas em commits antigos | PENDENTE |
| INV-007 | MEDIUM | Dependências | `npm audit` reportou `postcss` transitivo via `next` | PENDENTE |

## Pontos Que Precisam de Decisão Humana

- Confirmar se `app-plano-biblico` deve ser removido, arquivado ou mantido fora do deploy.
- Revisar manualmente `app-plano-biblico/.env.local` e remover segredos locais se não forem necessários.
- Auditar o repo do backend separado.
- Definir domínios reais de Vercel e Render para CORS, cookies SameSite e CSP.
- Definir processo seguro de bootstrap do admin inicial.
