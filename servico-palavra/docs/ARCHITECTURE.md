# Arquitetura Frontend

Este repositorio contem somente o frontend da plataforma.

## App

O app principal fica em `apps/web` e usa Next.js com App Router.

```text
apps/web/src/
  app/
  components/
  data/
  hooks/
  lib/
  types/
```

## Integracao

A comunicacao com o backend externo fica centralizada em `apps/web/src/lib/api.ts`.

- `NEXT_PUBLIC_API_URL` define a base da API.
- O token salvo no navegador e enviado no header `Authorization`.
- Erros HTTP sao convertidos em mensagens amigaveis para a interface.

## Principios

- Nao acessar banco direto no frontend.
- Nao usar Supabase no frontend.
- Nao implementar regra de negocio de backend no frontend.
- Manter mocks centralizados enquanto a API nao estiver pronta.
- Preservar a identidade visual atual ao evoluir a V2.
