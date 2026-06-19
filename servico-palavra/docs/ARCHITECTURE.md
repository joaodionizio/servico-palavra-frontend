# Arquitetura Frontend

Este repositorio contem somente o frontend da plataforma.

## App

O app principal fica em `apps/web` e usa Next.js com App Router.

```text
apps/web/src/
  app/
  components/
  hooks/
  lib/
  services/
  types/
```

## Integracao

A comunicacao com o backend externo fica centralizada em `apps/web/src/lib/api.ts`.

- `NEXT_PUBLIC_API_URL` define a base da API.
- Cookies HttpOnly sao enviados com `credentials: include`.
- Escritas usam CSRF pelo client HTTP.
- Erros HTTP sao convertidos em mensagens amigaveis para a interface.

## Principios

- Nao acessar banco direto no frontend.
- Nao usar Supabase no frontend.
- Nao implementar regra de negocio de backend no frontend.
- Usar API real para os fluxos da V2.
- Preservar a identidade visual atual ao evoluir a V2.
