# Secrets Management

Data: 2026-06-11

## Regras

- Nenhum secret deve ser versionado.
- `NEXT_PUBLIC_` é público e nunca deve conter segredo.
- Connection strings ficam em variáveis de ambiente do provedor.
- Segredos locais ficam em `.env.local` ou user-secrets e são ignorados.
- Rotação deve ser documentada.

## Estado Atual

- Frontend V2 usa somente `NEXT_PUBLIC_API_URL`, que é público.
- `.gitignore` ignora `.env` e `.env.*`, exceto `.env.example`.
- `servico-palavra/apps/web/.env.example` contém apenas exemplo de API URL.
- `app-plano-biblico/.env.local` existe localmente e precisa revisão humana.

## Histórico Git

Foram encontradas referências antigas a variáveis Supabase e service role no histórico, aparentemente com valores placeholder. Mesmo assim, qualquer valor real que tenha sido usado localmente deve ser considerado exposto se já foi commitado em algum momento fora deste checkout.

## Ações Recomendadas

- Remover o app legado ou mover para outro repositório se não será usado.
- Revisar `app-plano-biblico/.env.local` localmente.
- No backend, usar Secret Manager/user-secrets em dev e variáveis do Render/Neon em produção.
- Rotacionar qualquer secret real que tenha sido commitado em qualquer repo.

## `.env.example` Seguro

Permitido:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
```

Proibido:

```bash
JWT_SECRET=...
CONNECTION_STRING=...
SUPABASE_SERVICE_ROLE_KEY=...
GOOGLE_PRIVATE_KEY=...
```
