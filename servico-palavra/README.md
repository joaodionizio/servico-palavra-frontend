# Servico da Palavra

Frontend da plataforma **Servico da Palavra — Plataforma de Formacao Biblica e Espiritual**.

Este repositorio e somente do frontend. O backend ASP.NET Core vive em outro repositorio e deve ser consumido via API externa.

## Stack

- Next.js
- App Router
- React
- TypeScript
- Tailwind CSS
- Deploy futuro na Vercel

## Estrutura

```text
servico-palavra/
  apps/
    web/
  docs/
```

## Rodar o frontend

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

O frontend usa `NEXT_PUBLIC_API_URL` para apontar para a API externa.

Autenticacao esperada: cookie HttpOnly definido pelo backend. O frontend nao salva token no `localStorage`.

## Observacao

Nao ha backend, banco, Supabase ou seed neste repositorio. A V2 preserva a identidade visual do projeto atual e organiza as telas para consumir os endpoints do backend separado.
