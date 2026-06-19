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

Use `http://localhost:5000` para backend local, ou ajuste a porta conforme a configuracao da API.
Em producao, configure no provedor de deploy:

```bash
NEXT_PUBLIC_API_URL=https://servico-palavra-api.onrender.com
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
- Endpoints administrativos em `/api/admin/*`

## Rotas principais

- `/` redireciona para `/login`
- `/login`
- `/cadastro`
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

A V2 preserva a identidade do projeto atual: fundo claro, cards simples e navegacao direta. O plano biblico fica como modulo proprio, e os fluxos principais consomem a API real.
