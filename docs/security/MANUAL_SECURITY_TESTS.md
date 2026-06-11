# Manual Security Tests

Data: 2026-06-11

Executar apenas localmente ou em ambiente explicitamente autorizado.

## Sessão e Cookies

- Entrar e verificar cookie:
  - HttpOnly presente.
  - Secure em produção.
  - SameSite definido conscientemente.
  - nome não genérico.
- Remover cookie e acessar `/app/dashboard`; esperado: redirecionar para login e backend responder 401 em chamadas privadas.

## IDOR e Ownership

- Trocar GUID na URL de conteúdo/progresso/plano.
- Trocar GUID no body.
- Enviar `UsuarioId` de outro usuário.
- Enviar `PlanoOrigemId` de outro usuário.
- Tentar concluir dia de plano alheio.
- Tentar remover favorito de outro usuário.
- Resultado esperado: 404 ou 403, sem vazamento de existência excessivo.

## Admin

- Acessar endpoint admin como anônimo.
- Acessar endpoint admin como usuário comum.
- Alterar role no payload.
- Resultado esperado: 401/403; role manipulada ignorada.

## XSS e Mídias

- Enviar `<script>alert(1)</script>` em título/descrição.
- Enviar URL `javascript:alert(1)`.
- Enviar iframe de domínio externo não permitido.
- Enviar URL Drive/YouTube malformada.
- Resultado esperado: rejeição no backend ou renderização escapada.

## CSRF

- Fazer POST sem antiforgery token.
- Fazer PUT/PATCH/DELETE sem antiforgery token.
- Fazer requisição com origem indevida.
- Resultado esperado: bloqueio.

## Erros

- Forçar erro de validação.
- Forçar erro interno controlado.
- Verificar ausência de:
  - stack trace.
  - connection string.
  - nomes de tabelas desnecessários.
  - segredo/token.

## Headers

Verificar no navegador ou curl:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `Strict-Transport-Security` em HTTPS
- `X-Frame-Options: DENY`

## Deploy

- Confirmar que a Vercel aponta para `servico-palavra/apps/web`.
- Confirmar que o app legado não está sendo publicado.
- Confirmar `NEXT_PUBLIC_API_URL` com domínio correto da API.
