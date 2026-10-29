# Story E1-FE-02 — Fluxo de recuperação de senha

Status: in-progress  
Prioridade: P0  
Dependência: E1-BE-01-recuperacao-de-senha — concluída

## Objetivo
Adicionar um fluxo completo, responsivo e acessível de “Esqueci minha senha” e redefinição de senha integrado ao backend Identity.

## Implementação atual
- login possui link acessível “Esqueci minha senha”;
- página pública `/esqueci-senha`;
- página pública `/redefinir-senha` com `Suspense` e leitura de `userId`/`token` da URL;
- `requestPasswordReset` e `resetPassword` usam o client HTTP compartilhado e continuam protegidos por CSRF;
- shell de recuperação reutiliza a identidade visual do login;
- estados de loading, sucesso, erro, link ausente e token inválido/expirado;
- reset bem-sucedido não autentica automaticamente;
- token inválido oferece CTA “Solicitar novo link”;
- política de senha foi centralizada no frontend e alinhada ao Identity;
- cadastro deixou de impor máximo de 8 caracteres;
- dark mode e `prefers-reduced-motion` tratados explicitamente nos novos estados/CTAs.

## Fluxo 1 — Solicitar recuperação
1. Usuário abre `/esqueci-senha`.
2. Informa e-mail.
3. Frontend chama `POST /api/auth/password/forgot`.
4. Independentemente de existir conta, a UI mostra a mesma confirmação genérica fornecida pelo contrato.
5. A UI não indica “e-mail não cadastrado”.

## Fluxo 2 — Redefinir
1. Usuário chega em `/redefinir-senha?userId=...&token=...`.
2. Informa nova senha e confirmação.
3. Frontend valida a mesma política funcional do backend.
4. Envia `POST /api/auth/password/reset`.
5. Em sucesso, mostra confirmação e CTA para entrar.
6. Token inválido/expirado mostra mensagem clara e CTA para pedir novo link.

## Critérios de aceitação
1. Login possui link de recuperação acessível por teclado.
2. `/esqueci-senha` funciona em 320/390/768/1024/1440 sem overflow horizontal.
3. Mensagem após solicitação não revela se o e-mail existe.
4. Botão de envio possui estado de processamento sem dupla submissão.
5. `/redefinir-senha` rejeita localmente senhas divergentes antes da chamada de API.
6. Token/userId ausentes mostram estado inválido e não tentam reset.
7. Reset bem-sucedido oferece navegação para `/login`.
8. Token expirado/inválido oferece solicitar novo link.
9. Nenhum token é salvo em `localStorage`, `sessionStorage` ou cookie do frontend.
10. Token não é enviado a analytics/log manual adicionado por esta feature.
11. Dark mode, foco visível, labels/nome acessível e reduced motion são preservados.
12. E2E cobre solicitação genérica, dupla submissão, reset bem-sucedido, token inválido, storage/cookie, parâmetros ausentes, senhas divergentes e responsividade.
13. `npm run verify` permanece verde.

## E2E atual
A suíte mocka apenas `/mock-api/**`, sem depender de Render/Neon, e verifica:
- acesso por teclado ao fluxo;
- confirmação genérica;
- botão desabilitado durante request;
- reset válido sem auto-login;
- token não persistido em storage/cookie;
- token inválido com CTA de novo link;
- link sem parâmetros;
- senhas divergentes sem chamada de API;
- reduced motion/dark mode;
- ausência de overflow em cinco viewports.

## Visual
Reutiliza a linguagem visual da autenticação atual, evitando uma terceira identidade.

## Arquivos alterados
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/RecoveryAuthShell.tsx`
- `src/components/auth/ForgotPasswordForm.tsx`
- `src/components/auth/ResetPasswordForm.tsx`
- `src/app/esqueci-senha/page.tsx`
- `src/app/redefinir-senha/page.tsx`
- `src/lib/auth.ts`
- `src/lib/passwordPolicy.ts`
- `src/types/auth.ts`
- `tests/e2e/smoke.spec.ts`

## Verificação
Um novo `Frontend Verify` foi deliberadamente disparado após todos os arquivos acima estarem presentes na `main`, para eliminar a inconsistência observada em um run anterior que aparentava ter feito checkout de uma árvore incompleta/defasada. Somente este run sobre a árvore atual deve ser usado para fechar a story.

## Fora de escopo
- confirmação de e-mail;
- MFA;
- recuperação por SMS/WhatsApp;
- gerenciamento de senha dentro do perfil autenticado;
- provedor de e-mail no frontend.

## Definition of Done
- backend E1-BE-01 concluído;
- critérios 1–13 atendidos;
- `npm run verify` verde na árvore atual;
- story em `review` e code review independente aprovado.
