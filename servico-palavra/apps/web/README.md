# Servico da Palavra Web

Frontend V2 da plataforma **Servico da Palavra — Plataforma de Formacao Biblica e Espiritual**.

Este app e somente frontend. Ele nao cria backend, nao usa Supabase e nao acessa banco direto. A integracao acontece por uma API ASP.NET Core externa.

## Stack

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Playwright
- Deploy na Vercel

## Como rodar

```bash
npm install
npm run dev
```

O app abre em `http://localhost:3000`.

## Variaveis de ambiente

### Desenvolvimento local

Crie um `.env.local` com:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use `http://localhost:5000` para backend local, ou ajuste a porta conforme a configuracao da API.

### Producao na Vercel

Em producao, as chamadas do browser devem permanecer na mesma origem da Vercel para que cookies HttpOnly e CSRF sejam first-party.

Configure:

```bash
NEXT_PUBLIC_API_URL=/api/backend
API_BACKEND_URL=https://servico-palavra-api.onrender.com
```

`API_BACKEND_URL` e somente server-side e nao deve usar prefixo `NEXT_PUBLIC_`.
Nao configure `NEXT_PUBLIC_API_URL` diretamente com a URL publica do Render em producao; o client ja faz fallback seguro para `/api/backend`, mas manter a variavel explicita ajuda a evitar configuracao divergente.

O proxy fica em `src/app/api/backend/[...path]/route.ts` e encaminha cookies, CSRF e respostas para a API real.

## Integracao com backend

O client HTTP fica em `src/lib/api.ts`. Em desenvolvimento usa `NEXT_PUBLIC_API_URL`; em producao usa o proxy same-origin `/api/backend`.

Autenticacao esperada:

- backend com ASP.NET Core Identity;
- cookie de sessao HttpOnly;
- cookie Secure em producao;
- CSRF em operacoes de escrita;
- nenhum token de autenticacao ou reset salvo em `localStorage`.

Endpoints principais:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/password/forgot`
- `POST /api/auth/password/reset`
- `GET /api/dashboard/me`
- `GET /api/categorias`
- `GET /api/conteudos`
- `GET /api/conteudos/{slug}`
- `GET /api/favoritos`
- `POST /api/favoritos/{id}`
- `DELETE /api/favoritos/{id}`
- `POST /api/progresso/conteudos/{id}/concluir`
- `DELETE /api/progresso/conteudos/{id}/concluir`
- `GET /api/planos-biblicos/ativo`
- `POST /api/planos-biblicos`
- `POST /api/planos-biblicos/alterar`
- `GET /api/planos-biblicos/{id}/dias`
- `POST /api/planos-biblicos/dias/{diaId}/concluir`
- endpoints administrativos em `/api/admin/*`

## Rotas principais

- `/` redireciona para `/login`
- `/login`
- `/cadastro`
- `/esqueci-senha`
- `/redefinir-senha`
- `/app/dashboard`
- `/app/formacoes`
- `/app/formacoes/[slug]`
- `/app/favoritos`
- `/app/plano-biblico`
- `/app/plano-biblico/configurar`
- `/app/cronograma`
- `/app/perfil`
- `/admin/categorias`
- `/admin/conteudos`
- `/admin/conteudos/novo`
- `/admin/conteudos/[id]/editar`

## Quality gate

Na raiz do repositorio:

```bash
npm run verify
```

O CI executa audit de producao, type-check, lint, build e E2E de autenticacao, recuperacao de senha, responsividade, plano adaptativo, acessibilidade e admin.

## Smoke de producao

Depois que a versao estiver publicada:

```bash
PRODUCTION_BASE_URL=https://seu-app.vercel.app npm run smoke:production
```

Esse smoke nao usa credenciais e valida:

- `/login` e `/esqueci-senha`;
- headers de seguranca do frontend;
- proxy `/api/backend`;
- `/health` do backend;
- propagacao do `Server-Timing`;
- endpoint CSRF e cookie encaminhado pelo proxy same-origin.

Login real, reset por e-mail e operacoes administrativas continuam fazendo parte do smoke manual controlado do release, pois dependem de credenciais/SMTP do ambiente.

## Estrutura

```text
src/
  app/
  components/
    admin/
    auth/
    conteudos/
    dashboard/
    layout/
    plano-biblico/
    ui/
  hooks/
  lib/
  services/
  types/
```

## Observacao visual

A V2 preserva a identidade do projeto atual e agora compartilha design tokens, dark mode, estados de loading/erro/sucesso, responsividade e acessibilidade entre area do usuario e admin.
