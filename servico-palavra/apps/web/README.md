# Servico da Palavra Web

Frontend V2 da plataforma **Servico da Palavra — Plataforma de Formacao Biblica e Espiritual**.

Este app e somente frontend. Ele nao cria backend, nao usa Supabase e nao acessa banco direto. A integracao deve acontecer por uma API ASP.NET Core externa.

## Stack

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Deploy futuro na Vercel

## Como rodar

```bash
npm install
npm run dev
```

O app abre em `http://localhost:3000`.

## Variaveis de ambiente

Crie um `.env.local` com:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Integracao com backend

O client HTTP fica em `src/lib/api.ts` e usa `NEXT_PUBLIC_API_URL` como base. Ele possui metodos `get`, `post`, `put`, `patch` e `delete`, envia cookies com `credentials: "include"` e normaliza mensagens de erro para a interface.

Autenticacao esperada:

- backend com ASP.NET Core Identity;
- cookie de sessao HttpOnly;
- cookie Secure em producao;
- SameSite revisado para o dominio frontend/API;
- CSRF em operacoes de escrita quando cookies forem usados;
- nenhum token salvo em `localStorage`.

Endpoints esperados:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/me`
- `GET /api/categorias`
- `GET /api/conteudos`
- `GET /api/conteudos/{id}`
- `GET /api/favoritos`
- `POST /api/conteudos/{id}/favoritar`
- `DELETE /api/conteudos/{id}/favoritar`
- `POST /api/conteudos/{id}/concluir`
- `GET /api/trilhas`
- `GET /api/trilhas/{id}`
- `GET /api/planos-biblicos/ativo`
- `POST /api/planos-biblicos`
- `POST /api/planos-biblicos/alterar`
- `GET /api/planos-biblicos/{id}/dias`
- `POST /api/planos-biblicos/dias/{diaId}/concluir`
- Endpoints administrativos em `/api/admin/*`

## Rotas principais

- `/` redireciona para `/login`
- `/login`
- `/cadastro`
- `/app/dashboard`
- `/app/formacoes`
- `/app/formacoes/[slug]`
- `/app/trilhas`
- `/app/trilhas/[slug]`
- `/app/biblioteca`
- `/app/favoritos`
- `/app/plano-biblico`
- `/app/plano-biblico/configurar`
- `/app/cronograma`
- `/app/perfil`
- `/admin/dashboard`
- `/admin/conteudos`
- `/admin/conteudos/novo`
- `/admin/conteudos/[id]/editar`
- `/admin/categorias`
- `/admin/trilhas`
- `/admin/trilhas/nova`
- `/admin/usuarios`
- `/admin/rankings`

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
    trilhas/
    ui/
  data/
  hooks/
  lib/
  types/
```

## Observacao visual

A V2 preserva a identidade do projeto atual: fundo claro, verde como cor principal, cards simples, sidebar lateral e navegacao direta. O plano biblico fica como modulo proprio e nao como primeira experiencia apos login.

Enquanto a API nao estiver pronta, `src/data/mocks.ts` centraliza dados temporarios para facilitar a troca posterior pelos endpoints reais.
